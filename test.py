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


txt = ''
def readfile(txt):
    for line in f:
        for x in line:
            if len(x.encode('utf-8')) == 4 and x.encode('utf-8')[0] == 244:
                x=''
            txt = txt+x
    print(txt)
    w.write('receive sentence :'+txt+'\n')
    f.close()
    txt.split('\n')
    return txt

    
def wordprocess(txt):
    #tags = jieba.analyse.extract_tags(line, 15)
    tags = jieba.cut_for_search(txt)
    #tags = jieba.cut(line, cut_all=True)
    #tags = jieba.analyse.textrank(line, topK=20, withWeight=False, allowPOS=('ns', 'n', 'vn', 'v'))
    # for word in words:
       # print(word)
    #i = 1
    #for x in tags:
    #    print('importance word', i, ': ' + x)
    #    i = i + 1
    remainderWords = list(filter(lambda a: a not in stopWords and a != '\n', tags))
    #->finding most frequent words ex: 無線 線網 網路 無線網 --> 無線網路
    past1=''
    past2=''
    for x in remainderWords:
        if past1=='' and past2=='':
            past1=x
        elif past1!='' and past2=='':
            if x[:len(past1)]==past1:
                remainderWords.remove(past1)
                past1=''
            else:
                past2=past1
                past1=x
        else:

            if x==past2+past1:  # aa+bb=aabb->aabb
                remainderWords.remove(past1)
                remainderWords.remove(past2)
                past1=past2=''
            elif x[:len(past1)]==past1:
                remainderWords.remove(past1)
                past1=past2=''
            elif x[:len(past2)]==past2 :
                remainderWords.remove(past2)
                past1 = past2 = ''
            else:
                past2 = past1
                past1 = x

    i=1
    w.write('word segment : ')
    for k in remainderWords:
        if k!=' ':
            print('importance word', i, ': ' + k)
            #w.write('importance word ')
            #w.write(str(i))
            w.write(k)
            w.write(', ')
            i=i+1
    w.close()


wordprocess(readfile(txt))