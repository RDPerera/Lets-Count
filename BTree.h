#ifndef _BTREE_INCLUDED_

#define _BTREE_INCLUDED_
#include <iostream>
#include "Node.h"
#include "Info.h"

using namespace std;

class BTree
{
    public:
        BTree(unsigned int);
        void add(Info*);
        void remove(Info*);
        friend ostream& operator<<(ostream&, const BTree&);
        string preorder();
        string inorder();
        string postorder();

    private:
        Node* root;
        unsigned int n;
};

#endif
