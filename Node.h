#ifndef _NODE_INCLUDED_

#define _NODE_INCLUDED_
#include "Info.h"
#include <iostream>

using namespace std;

class Node
{
    public:
        Node(unsigned int);
        void addInfo(Info*);
        void removeInfo(Info*);
        Info* popMax();
        Info* popMin();
        bool isLeaf();
        int getInfoAmount();
        Node** getChildren();
        string preorder();
        string inorder();
        string postorder();
        friend ostream& operator<<(ostream&, const Node&);

    private:
        Info** infoArr;
        Node** ptrArr;
        unsigned int order;
        unsigned int elements;
        void clearNode(unsigned int);
};

#endif
