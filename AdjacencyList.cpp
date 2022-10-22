#include<iostream>
using namespace std;

struct node
{
    int value;
    struct node * next;
};

struct node ** createGraph(int n)
{
    struct node ** graph=new struct node *[n];
    for (int i = 0; i < n; i++)
    {
        graph[i]=new struct node;
    }
    return graph;
}

//insert function
void insert(struct node ** graph,int con1,int con2){
    struct node *temp;
    temp=graph[con1];
    while(temp->next!=NULL)
    {
        temp=temp->next;
    }
    temp->value=con2;
    temp->next=new struct node;

    temp=graph[con2];
    while(temp->next!=NULL)
    {
        temp=temp->next;
    }
    temp->value=con1;
    temp->next=new struct node;
}

//display 2d graph
void display(struct node ** graph,int n){
    for (int i = 0; i < n; i++)
    {
        cout << i << "->";
		cout << i << "->";
        struct node *temp;
        temp=graph[i];
        while(temp->next!=NULL)
        {
            cout << temp->value ;
            if (temp->next->next!=NULL)
            {
                cout << "->";
            }
            temp=temp->next;
        }
        cout  << endl;
    }
}


int main(){
    int n,con1,con2;
    cout << "Enter number of nodes :";
    cin >> n;
    struct node ** graph=createGraph(n);
    for (int i = 0; i < n-1; i++)
    {
        cout << "Enter connection :";
        cin >> con1 >> con2;
        insert(graph,con1,con2);
    }
    display(graph,n);
    
    return 0;
}
