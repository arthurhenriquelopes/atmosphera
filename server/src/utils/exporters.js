import { Parser } from '@json2csv/plainjs';
import * as js2xmlparser from 'js2xmlparser';
import PDFDocument from 'pdfkit';

export function toJSON(records) {
  return JSON.stringify(records, null, 2);
}

export function toCSV(records) {
  if (!records.length) return '';
  const parser = new Parser();
  return parser.parse(records);
}

export function toXML(records) {
  return js2xmlparser.parse('weatherRecords', { record: records });
}

export function toMarkdown(records) {
  if (!records.length) return '# Weather Records\n\nNo records found.';

  const headers = '| ID | Location | Temperature | Description | Date Start | Date End |';
  const divider = '|---|---|---|---|---|---|';
  const rows = records.map(
    (r) =>
      `| ${r.id} | ${r.location} | ${r.temperature}°C | ${r.description} | ${new Date(r.dateStart).toLocaleDateString()} | ${new Date(r.dateEnd).toLocaleDateString()} |`
  );

  return `# Weather Records\n\n${headers}\n${divider}\n${rows.join('\n')}`;
}

export function toPDF(records) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    doc.fontSize(20).text('Atmosphera — Weather Records', { align: 'center' });
    doc.moveDown();

    if (!records.length) {
      doc.fontSize(12).text('No records found.');
    } else {
      records.forEach((r, i) => {
        doc.fontSize(14).text(`${i + 1}. ${r.location}`, { underline: true });
        doc.fontSize(11)
          .text(`Temperature: ${r.temperature}°C`)
          .text(`Description: ${r.description}`)
          .text(`Period: ${new Date(r.dateStart).toLocaleDateString()} — ${new Date(r.dateEnd).toLocaleDateString()}`);
        doc.moveDown(0.5);
      });
    }

    doc.end();
  });
}
