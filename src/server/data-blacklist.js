var blacklist = [
  '.', ',', ';', '*', '?', '!', '@', '~', '#', '$', '%', '&',
  'a', 'an', 'the', 'some',
  'this', 'that', 'these', 'those',
  'i', 'you', 'me', 'he', 'him',  'she', 'they', 'them', 'it', 'we',
  'my', 'your', 'his','her', 'their', 'its', 'ours',
  'yes', 'no',
  'is', 'am', 'are', 'was', 'were', 'been', 'be',
  'has', 'have', 'had',
  'of', 'for', 'in', 'at', 'on', 'by', 'de', 'from', 'to',
  'but','and', 'or', 'as', 'so',
  'which', 'what', 'when', 'how', 'there', 'where', 'whom',
  'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'o',
  'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];

module.exports = blacklist;
