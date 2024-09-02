export default (cdata) =>
  cdata
    .replace('<![CDATA[', '')
    .replace(']]>', '')
    .replace(']]', '')
    .replace('[CDATA[', '');
