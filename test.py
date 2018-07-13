import sys
import json
import jieba
import jieba.analyse

f=open("sentence.txt",encoding = 'utf8')
jieba.set_dictionary('dict.txt.big')
#jieba.analyse.set_idf_path(file_name)
w=open("output.txt",'w')

stopWords=[]
segments=[]
remainderWords=[]
with open('stopwords.txt', 'r', encoding='utf8') as file:
    for data in file.readlines():
        data = data.strip()
        stopWords.append(data)



for line in f:
    a=''
    for x in line:
        if len(x.encode('utf-8')) == 4 and x.encode('utf-8')[0] == 244:
            x=''
        print(x)
        a=a+x
    print(a)
    w.write('receive sentence :'+a+'\n')
    tags = jieba.analyse.extract_tags(line, 15)
    # words = jieba.cut(line, cut_all=True)
    # for word in words:
       # print(word)
    #i = 1
    #for x in tags:
    #    print('importance word', i, ': ' + x)
    #    i = i + 1
    remainderWords = list(filter(lambda a: a not in stopWords and a != '\n', tags))

    i=1
    for k in remainderWords:
        print('importance word', i, ': ' + k)
        w.write('importance word ')
        w.write(str(i))
        w.write(' : '+k)
        w.write('\n')
        i=i+1
    w.write('\n')
f.close()