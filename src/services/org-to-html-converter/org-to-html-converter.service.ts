import { Injectable } from '@angular/core';

export interface IPlaceholderSubstitution {
  placeholder: string;
  substitution: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrgToHtmlConverterService {
  private tags = {
    '#+title:': { htmlTag: 'h1 class="text-6xl"' },
    '#+author:': {
      htmlTag: 'div class="size-fit px-2 py-1 rounded-xl bg-blue-300"',
    },
    '#+date:': {
      htmlTag: 'div class="size-fit px-2 py-1 rounded-xl bg-blue-300"',
    },
    '* ': { htmlTag: 'h1 class="text-4xl"' },
    '** ': { htmlTag: 'h2 class="text-2xl"' },
    '- ': { htmlTag: 'li' },
  };

  convert(
    orgText: string,
    placeholderSubstitutions?: IPlaceholderSubstitution[],
  ) {
    let divStarted = false;
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
      // Check for org link pattern and replace it with HTML anchor tag
      const orgLinkPattern = /\[\[(.*?)]\[(.*?)]]/g;
      const replacer = (_: string, g1: string, g2: string) =>
        `<a href="${g1}" target="_blank" class="text-rose-600 hover:underline">${g2}</a>`;
      line = line.replace(orgLinkPattern, replacer);

      // Check for code pattern and replace it with HTML code tag
      const codePattern = /~(.*?)~/g;
      if (codePattern.test(line)) {
        const replacerCode = (_: string, g1: string) => `${g1}`;
        line = line.replace(codePattern, replacerCode);
      }

      for (const tag in this.tags) {
        if (line.startsWith(tag)) {
          const key = tag as keyof typeof this.tags;
          return `<${this.tags[key].htmlTag}>${line.slice(tag.length)}</${this.tags[key].htmlTag.split(' ')[0]}>`;
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

      //skip BEGIN_SRC html and #+END_SRC (html inside will be added in any case)
      if (line == '#+BEGIN_SRC html' || line == '#+END_SRC') {
        return '';
      }

      return line;
    });

    return htmlLines.join('\n');
  }
}
