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

class Queue  
{  
    public: 
    int front, rear, size;  
    unsigned capacity;  
    int* array;  
}; 
 
Queue* createQueue(unsigned capacity)  
{  
    Queue* queue = new Queue(); 
    queue->capacity = capacity;  
    queue->front = queue->size = 0;  
    queue->rear = capacity - 1; 
    queue->array = new int[(queue->capacity * sizeof(int))];  
    return queue;  
}  
  

int isFull(Queue* queue)  
{ return (queue->size == queue->capacity); }  

int isEmpty(Queue* queue)  
{ return (queue->size == 0); }  
 
void enqueue(Queue* queue, int item)  
{  
    if (isFull(queue))  
        return;  
    queue->rear = (queue->rear + 1) % queue->capacity;  
    queue->array[queue->rear] = item;  
    queue->size = queue->size + 1;  
}  

int dequeue(Queue* queue)  
{  
    if (isEmpty(queue))  
        return -1;  
    int item = queue->array[queue->front];  
    queue->front = (queue->front + 1) % queue->capacity;  
    queue->size = queue->size - 1;  
    return item;  
}

int main()
{   
    int n,con1,con2;
    cout << "Enter number of nodes:";
    cin >> n;
    int visitedArr[n];
    for (int i = 0; i < n; i++)
    {
        visitedArr[i]=0;
    }
    
    Queue *queue=createQueue(n);
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
    enqueue(queue,currNode);
    visitedArr[currNode]=1;
    while (!isEmpty(queue))
    {
        currNode=dequeue(queue);
        cout << currNode << " ->";
        for (int i = 0; i < n; i++)
        {
        if (graph[currNode][i]!=0)
        {
            if(visitedArr[i]==0)
            {
                visitedArr[i]=1;
                enqueue(queue,i);
            }
        }
        } 
    }
    return 0;
}