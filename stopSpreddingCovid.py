arr=list(map(int,input().split()))
n=len(arr)
l = [1 for i in range(n)] 

for i in range(0,int(n/2)):
    for j in range(0, n-1):
        #if l[j]<l[j+1]:
        if arr[j] > arr[j+1] and (l[j]<=l[j+1]) :
            l[j]+=1
        elif arr[j] < arr[j+1] and (l[j]>=l[j+1]):
            l[j+1]+=1
        
print(sum(l))
