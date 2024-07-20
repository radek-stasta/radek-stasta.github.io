import { Injectable } from '@angular/core';
import hljs from 'highlight.js';

export interface IPlaceholderSubstitution {
  placeholder: string;
  substitution: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrgToHtmlConverterService {
  private tags = {
    '#+title:': { htmlTag: 'h1 class="text-6xl font-bold"' },
    '#+author:': {
      htmlTag: 'div class="size-fit px-2 py-1 rounded-xl bg-indigo-100"',
    },
    '#+date:': {
      htmlTag: 'div class="size-fit px-2 py-1 rounded-xl bg-indigo-100"',
    },
    '* ': { htmlTag: 'h1 class="text-4xl my-8 font-bold"' },
    '** ': { htmlTag: 'h2 class="text-2xl my-6 font-bold"' },
    '- ': { htmlTag: 'li' },
  };

  private _hTagID = 0;
  protected _divStarted = false;

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

  handleImgPattern(line: string) {
    const orgImageLinkPattern = /\[\[(.*?)]]/g;
    const replacerImage = (_: string, g1: string) => {
      return `<img src="${g1}" class="h-auto max-w-full" alt="${g1}"/>`;
    };
    return line.replace(orgImageLinkPattern, replacerImage);
  }

  handleTags(line: string) {
    for (const tag in this.tags) {
      if (line.startsWith(tag)) {
        const key = tag as keyof typeof this.tags;

        // Check if current tag is h and add id
        const tagWithId = this.tags[key].htmlTag.startsWith('h')
          ? `${this.tags[key].htmlTag} id="hTag${this._hTagID++}"`
          : this.tags[key].htmlTag;

        return `<${tagWithId}>${line.slice(tag.length)}</${tagWithId.split(' ')[0]}>`;
      }
    }

    return undefined;
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

    this.handlePlaceholders(lines, placeholderSubstitutions);

    const htmlLines = lines.map((line, index) => {
      // Check for bold text patter and replace it with HTML tag with bold text
      line = this.handleBoldPattern(line);

      // Check for org link pattern and replace it with HTML anchor tag
      line = this.handleLinkPattern(line);

      // Check for org image link pattern and replace it with HTML img tag
      line = this.handleImgPattern(line);

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

      return line;
    });

    return htmlLines.join('\n');
  }
}
