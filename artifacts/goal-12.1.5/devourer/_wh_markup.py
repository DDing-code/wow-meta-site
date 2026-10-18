import re, io
# Wowhead 가이드 원문 마크업(BBCode) 문자열을 찾아 읽기 쉬운 텍스트로 저장
s = open('wowhead-devourer-rotation.html', encoding='utf-8').read()
k = s.find('[display-option=')
start = s.rfind('Welcome to the Devourer Demon Hunter rotation guide', 0, k)
end = s.find('"', k)
while s[end - 1] == '\\':
    end = s.find('"', end + 1)
t = s[start:end]
t = t.replace('\\/', '/').replace('\\"', '"').replace('\\r', '').replace('\\n', '\n').replace('\\t', ' ')
t = re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m.group(1), 16)), t)
t = re.sub(r'\[spell=(\d+)[^\]]*\]', r'{\1}', t)
t = re.sub(r'\[url=[^\]]*\]|\[/url\]', '', t)
t = re.sub(r'\[/?(color|b|i|u|small|span|wrapper|grid|center|tooltip|icon-badge|minor-heading|h\d)[^\]]*\]', '', t)
t = re.sub(r'[ \t]+', ' ', t)
t = re.sub(r'\n\s*\n+', '\n', t)
io.open('wowhead-rotation-markup.txt', 'w', encoding='utf-8').write(t)
print(len(t), start, k, end)
