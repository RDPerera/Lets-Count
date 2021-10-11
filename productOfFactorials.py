import math 
   
n=int(input())
number=input()
total=1
p=[7,5,3,2]
a=[]


def Digits(n): 
    
    largest = 0
  
    while (n): 
        r = n % 10
        largest = max(r, largest)
  
        n = n // 10
  
    return largest 

maxdig=Digits(int(number)) 
print(maxdig)
for i in number:
    k=int(i)
    f=math.factorial(k)
    total=total*f
print(total)
t=1
for i in p:
    if i<=maxdig:
        count=0
        while t*math.factorial(i)<=total and (total//t)%i==0:
            t=t*math.factorial(i)
            a.append(i)
            count+=1
        
    else:
        continue
print(t)
for i in a:
    print(i,end="")
