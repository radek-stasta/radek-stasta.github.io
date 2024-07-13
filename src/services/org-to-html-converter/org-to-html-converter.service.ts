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
    '#+title:': { htmlTag: 'h1 class="text-4xl"' },
    '#+author:': {
      htmlTag: 'div class="size-fit px-2 py-1 rounded-xl bg-blue-300"',
    },
    '#+date:': {
      htmlTag: 'div class="size-fit px-2 py-1 rounded-xl bg-blue-300"',
    },
    '* ': { htmlTag: 'h1 class="text-4xl"' },
    '** ': { htmlTag: 'h1 class="text-2xl"' },
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
      for (const tag in this.tags) {
        if (line.startsWith(tag)) {
          const key = tag as keyof typeof this.tags;
          return `<${this.tags[key].htmlTag}>${line.slice(tag.length)}</${this.tags[key].htmlTag.split(' ')[0]}>`;
        }
      }

      //empty line, new paragraphs
      if (line.length == 0) {
        if (divStarted) {
          divStarted = false;
          return '</div>';
        } else if (index !== lines.length - 1) {
          divStarted = true;
          return '<div>';
        }
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
