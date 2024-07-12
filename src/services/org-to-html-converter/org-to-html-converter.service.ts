import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrgToHtmlConverterService {
  private tags = {
    '#+title:': { htmlTag: 'h1 class="text-4xl"' },
    '* ': { htmlTag: 'h1 class="text-4xl"' },
    '** ': { htmlTag: 'h1 class="text-2xl"' },
  };

  convert(orgText: string) {
    let divStarted = false;
    const lines = orgText.split('\n');
    const htmlLines = lines.map((line, index) => {
      for (const tag in this.tags) {
        if (line.startsWith(tag)) {
          const key = tag as keyof typeof this.tags;
          return `<${this.tags[key].htmlTag}>${line.slice(tag.length)}</${this.tags[key].htmlTag.split(' ')[0]}>`;
        }
      }

      if (line.length == 0) {
        if (divStarted) {
          divStarted = false;
          return '</div>';
        } else if (index !== lines.length - 1) {
          divStarted = true;
          return '<div>';
        }
      }

      return line;
    });

    return htmlLines.join('\n');
  }
}
