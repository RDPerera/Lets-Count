#include<iostream>
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
		cout<< endl;
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
    int n,con1,con2;
    cout << "Enter number of nodes:";
    cin >> n;   
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
    return 0;
	display(graph,n);
}