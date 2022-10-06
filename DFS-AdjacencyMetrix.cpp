#include<iostream>
#include<stack>
using namespace std;


//initialized all values to 0
void initZero(int **graph,int n) 
{
    for (int i = 0; i < n; i++)
    {
        for (int j = 0; j < n; j++)
        {
            graph[i][j]=0;
        }
        
    }
}


//display 2d graph
void display(int **graph,int n)  
{
    cout << endl;
    for (int i = 0; i < n; i++)
    {
        for (int j = 0; j < n; j++)
        {
            cout << graph[i][j]<< " ";
        }
        cout<< endl;
    }
}


//create 2d metrix size of nxn
int** createGraph(int n)
{
    int **graph=new int*[n];
    for (int i = 0; i < n; i++)
    {
        graph[i]=new int[n];
    }
    return graph;
}



int main()
{   
    stack <int> stack;
    int n,con1,con2;
    cout << "Enter number of nodes:";
    cin >> n;
    int visitedArr[n];
    for (int i = 0; i < n; i++)
    {
        visitedArr[i]=0;
    }
    
    int ** graph=createGraph(n);
    initZero(graph,n);
    for (int i = 0; i < n-1; i++)
    {
        cout << "Enter connection(starting with 0) :";
        cin >> con1 >> con2;
        graph[con1][con2]=1;
        graph[con2][con1]=1;
    }
    display(graph,n);
    int currNode=0;
    stack.push(currNode);
    visitedArr[currNode]=1;
    cout << currNode << "->";
    while (!stack.empty())
    {
        currNode=stack.top();
        stack.pop();
        visitedArr[currNode]=1;
        for (int i = 0; i < n; i++)
        {
            if(graph[currNode][i])
            {
                if(visitedArr[i]!=1)
                {
                    stack.push(i);
                    cout << i << "->";
                }
            }
        }
        
    }
    
    return 0;
}


