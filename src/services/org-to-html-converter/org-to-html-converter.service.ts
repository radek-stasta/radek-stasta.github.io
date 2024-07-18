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
      htmlTag: 'div class="size-fit px-2 py-1 rounded-xl bg-blue-300"',
    },
    '#+date:': {
      htmlTag: 'div class="size-fit px-2 py-1 rounded-xl bg-blue-300"',
    },
    '* ': { htmlTag: 'h1 class="text-4xl my-6 font-bold"' },
    '** ': { htmlTag: 'h2 class="text-2xl my-4 font-bold"' },
    '- ': { htmlTag: 'li' },
  };

  convert(
    orgText: string,
    placeholderSubstitutions?: IPlaceholderSubstitution[],
  ) {
    let divStarted = false;
    let inCodeBlock = false;
    let codeBlockBuffer = '';
    let hTagID = 0;
    const lines = orgText.split('\n');

    //look through lines and for each placeholderSubstitution replace placeholder with substitution
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

    const htmlLines = lines.map((line, index) => {
      // Check for bold text patter and replace it with HTML tag with bold text
      const boldPattern = /(?<!^)\*(.*?)\*/g;
      const replacerBold = (_: string, g1: string) =>
        `<span class="font-bold">${g1}</span>`;
      line = line.replace(boldPattern, replacerBold);

      // Check for org link pattern and replace it with HTML anchor tag
      const orgLinkPattern = /\[\[(.*?)]\[(.*?)]]/g;
      const replacer = (_: string, g1: string, g2: string) =>
        `<a href="${g1}" target="_blank" class="text-rose-600 hover:underline">${g2}</a>`;
      line = line.replace(orgLinkPattern, replacer);

      // Check for remaining org link pattern and consider it as an image link
      const orgImageLinkPattern = /\[\[(.*?)]]/g;
      const replacerImage = (_: string, g1: string) => {
        return `<img src="${g1}" class="h-auto max-w-full"/>`;
      };
      line = line.replace(orgImageLinkPattern, replacerImage);

      // Check for code pattern and replace it with HTML code tag with highlighting
      // Check if line starts a code block
      const codePattern = /~(.*?)~/g;
      if (line.startsWith('~')) {
        inCodeBlock = true;
        codeBlockBuffer += `${line.match(codePattern)![0]}\n`;
        codeBlockBuffer = codeBlockBuffer.replace(/~/g, '');
        return;
      }

      // Check if line ends a code block
      if (inCodeBlock && !line.startsWith('~')) {
        inCodeBlock = false;
        const blockToReplace = `<pre class="hljs p-4 rounded-xl mb-4"><code>${hljs.highlightAuto(codeBlockBuffer).value}</code></pre>`;
        codeBlockBuffer = '';
        return blockToReplace;
      }

      // Replace specific tags
      for (const tag in this.tags) {
        if (line.startsWith(tag)) {
          const key = tag as keyof typeof this.tags;

          // Check if current tag is h and add id
          const tagWithId = this.tags[key].htmlTag.startsWith('h')
            ? `${this.tags[key].htmlTag} id="hTag${hTagID++}"`
            : this.tags[key].htmlTag;

          return `<${tagWithId}>${line.slice(tag.length)}</${tagWithId.split(' ')[0]}>`;
        }
      }

      //empty line, new paragraphs
      if (line.length == 0) {
        let divTag = '';
        if (divStarted) {
          divStarted = false;
          divTag += '</div>';
        }

        if (index !== lines.length - 1) {
          divStarted = true;
          divTag += '<div class="mb-4 text-justify">';
        }

        return divTag;
      }

      //comments (just print them)
      if (line.startsWith('# ')) {
        return line.slice(2);
      }

      return line;
    });

    return htmlLines.join('\n');
  }
}
