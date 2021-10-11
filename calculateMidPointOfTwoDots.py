n=int(input())
for i in range(0,n):
    a=list(map(int,input().split()))
    Ax=a[1]
    Ay=a[2]
    Bx=a[3]
    By=a[4]
    Cx=a[5]
    Cy=a[6]
   
    if a[0]>=100 and a[0]<=170:
        q=Ax * (By - Cy) + Bx * (Cy - Ay) + Cx * (Ay - By)
        if (q==0):
            print("BAD")
        else:
             print("GOOD")
    else:
        print("BAD")
