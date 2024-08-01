import { Injectable } from '@angular/core';
import hljs from 'highlight.js';

export enum EHeadingType {
  h1 = 'h1',
  h2 = 'h2',
}

export interface ISummaryLine {
  id: string;
  text: string;
  type: EHeadingType;
}

export interface IPlaceholderSubstitution {
  placeholder: string;
  substitution: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrgToHtmlConverterService {
  private tags = {
    '#+title:': { htmlTag: 'h1 class="text-4xl sm:text-6xl font-bold"' },
    '#+author:': {
      htmlTag: 'div class="size-fit px-2 py-1 my-1 rounded-xl bg-indigo-100"',
    },
    '#+date:': {
      htmlTag: 'div class="size-fit px-2 py-1 my-1 rounded-xl bg-indigo-100"',
    },
    '#+TAGS:': {
      htmlTag: 'div class="size-fit px-2 py-1 rounded-xl bg-rose-100"',
    },
    '* ': { htmlTag: 'h1 class="text-2xl sm:text-4xl my-8 font-bold"' },
    '** ': { htmlTag: 'h2 class="text-xl sm:text-2xl my-6 font-bold"' },
    '- ': { htmlTag: 'li' },
  };

  private _hTagID = 0;
  private _summaryLines: ISummaryLine[] = [];

  protected _divStarted = false;

  public get summaryLines() {
    return this._summaryLines;
  }

  handlePlaceholders(
    lines: string[],
    placeholderSubstitutions?: IPlaceholderSubstitution[],
  ) {
    if (placeholderSubstitutions) {
      placeholderSubstitutions.forEach((substitution) => {
        lines.forEach((line, index) => {
          lines[index] = line.replace(
            `{{${substitution.placeholder}}}`,
            substitution.substitution,
          );
        });
      });
    }
  }

  handleBoldPattern(line: string) {
    const boldPattern = /(?<!^)\*(.*?)\*/g;
    const replacerBold = (_: string, g1: string) =>
      `<span class="font-bold">${g1}</span>`;
    return line.replace(boldPattern, replacerBold);
  }

  handleLinkPattern(line: string) {
    const orgLinkPattern = /\[\[(.*?)]\[(.*?)]]/g;
    const replacer = (_: string, g1: string, g2: string) =>
      `<a href="${g1}" target="_blank" class="text-rose-500 hover:underline">${g2}</a>`;
    return line.replace(orgLinkPattern, replacer);
  }

  handleImgPattern(line: string, lines: string[], index: number) {
    let altText = '';
    if (index > 0 && lines[index - 1].startsWith('#+ATTR_HTML: :alt')) {
      altText = lines[index - 1].replace('#+ATTR_HTML: :alt', '').trim();
    }

    const orgImageLinkPattern = /\[\[(.*?)]]/g;
    const replacerImage = (_: string, g1: string) => {
      return `<div class="flex flex-col place-items-center">
                <div class="border-2 border-indigo-500 rounded-2xl">
                  <img class="rounded-t-2xl" src="${g1}" alt="${altText || g1}"/>
                  <div class="rounded-b-2xl bg-indigo-100 border-t border-indigo-500 text-center">${altText || g1}</div>
                </div>
              </div>`;
    };
    return line.replace(orgImageLinkPattern, replacerImage);
  }

  handleTags(line: string) {
    for (const tag in this.tags) {
      if (line.startsWith(tag)) {
        const key = tag as keyof typeof this.tags;

        // Check if current tag is h, add it to summaryLines and add id
        const htmlTag = this.tags[key].htmlTag;
        let tagWithId: string;

        if (htmlTag.startsWith('h') && key != '#+title:') {
          const id = `hTag${this._hTagID++}`;
          const headingLineText = line.slice(tag.length);
          const type = htmlTag.split(' ')[0] as EHeadingType;

          const summaryLine: ISummaryLine = {
            id,
            text: headingLineText,
            type: type,
          };

          // add to summary lines
          this._summaryLines.push(summaryLine);

          // add id
          tagWithId = `${this.tags[key].htmlTag} id="${id}"`;
        } else {
          tagWithId = this.tags[key].htmlTag;
        }

        // Special handling for the '#+TAGS:' line to generate individual divs
        if (tag === '#+TAGS:') {
          // Get all tags from line
          const tagsInLine = line.slice(tag.length).trim().split(' ');

          // Construct one div for each tag
          const tagDivs = tagsInLine.map(
            (tagInLine) =>
              `<${tagWithId}>${tagInLine}</${tagWithId.split(' ')[0]}>`,
          );

          // Wrap all tags into a parent div
          return `<div class="flex flex-row gap-1 my-1">${tagDivs.join('\n')}</div>`;
        }

        return `<${tagWithId}>${line.slice(tag.length)}</${tagWithId.split(' ')[0]}>`;
      }
    }
    return undefined;
  }

  printOrSkipLine(line: string) {
    if (line.startsWith('#+ATTR_HTML: :alt')) {
      return '';
    } else {
      return line;
    }
  }

  handleEmptyLine(index: number, lines: string[]) {
    let divTag = '';
    if (this._divStarted) {
      this._divStarted = false;
      divTag += '</div>';
    }

    if (index !== lines.length - 1) {
      this._divStarted = true;
      divTag += '<div class="my-8 text-justify">';
    }

    return divTag;
  }

  convert(
    orgText: string,
    placeholderSubstitutions?: IPlaceholderSubstitution[],
  ) {
    let inCodeBlock = false;
    let codeBlockBuffer = '';
    const lines = orgText.split('\n');

    this._hTagID = 0;
    this._divStarted = false;
    this._summaryLines = [];

    this.handlePlaceholders(lines, placeholderSubstitutions);

    const htmlLines = lines.map((line, index) => {
      // Check for bold text patter and replace it with HTML tag with bold text
      line = this.handleBoldPattern(line);

      // Check for org link pattern and replace it with HTML anchor tag
      line = this.handleLinkPattern(line);

      // Check for org image link pattern and replace it with HTML img tag
      line = this.handleImgPattern(line, lines, index);

      // Check for code pattern and replace it with HTML code tag with highlighting
      // Check if line starts a code block
      const codePattern = /~(.*?)~/g;
      if (line.startsWith('~')) {
        inCodeBlock = true;
        codeBlockBuffer += `${line.match(codePattern)![0]}\n`;
        codeBlockBuffer = codeBlockBuffer.replace(/~/g, '');
        if (lines[index + 1].startsWith('~')) {
          return;
        }
      }

      // Check if line ends a code block
      if (inCodeBlock && !lines[index + 1].startsWith('~')) {
        inCodeBlock = false;
        const blockToReplace = `<pre class="hljs p-4 rounded-xl mb-4 overflow-auto"><code>${hljs.highlightAuto(codeBlockBuffer).value}</code></pre>`;
        codeBlockBuffer = '';
        return blockToReplace;
      }

      // Replace specific tags
      const tagResult = this.handleTags(line);
      if (tagResult) {
        return tagResult;
      }

      // Handle empty lines
      if (line.length == 0) {
        return this.handleEmptyLine(index, lines);
      }

      return this.printOrSkipLine(line);
    });

    return htmlLines.join('\n');
  }
}
