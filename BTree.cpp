#include <iostream>
#include <sstream>
#include <cmath>
#include <queue>
#include "Info.h"
#include "BTree.h"

BTree::BTree(unsigned int n)
{
    this->n = n;
    this->root = NULL;
}

void BTree::add(Info* i)
{
    if (this->root == NULL)
        this->root = new Node(this->n);

    this->root->addInfo(i);
}

void BTree::remove(Info* i)
{
    if (this->root != NULL)
    {
        this->root->removeInfo(i);
        if (this->root->getInfoAmount() == 0) // The root is now empty
        {
            delete this->root;
            this->root = NULL;
        }
    }
}

string BTree::preorder()
{
    stringstream ss;
    if (this->root != NULL)
        ss << this->root->preorder();

    string s = ss.str();
    s = s.substr(0, s.size() - 2); //Removes the last comma + space
    s += '\n';
    return s;
}

string BTree::inorder()
{
    stringstream ss;
    if (this->root != NULL)
        ss << this->root->inorder();

    string s = ss.str();
    s = s.substr(0, s.size() - 2); //Removes the last comma + space
    s += '\n';
    return s;
}

string BTree::postorder()
{
    stringstream ss;
    if (this->root != NULL)
        ss << this->root->postorder();

    string s = ss.str();
    s = s.substr(0, s.size() - 2); //Removes the last comma + space
    s += '\n';
    return s;
}

ostream& operator<<(ostream& os, const BTree& tree)
{
    if (tree.root == NULL)
        return os;

    int actualDepth = 0, qtd = 0;

    queue<Node*> sequence;
    sequence.push(tree.root);
    while (!sequence.empty())
    {
        Node* actual = sequence.front();
        sequence.pop();
        qtd++;

        bool newLine = false;
        if (pow(tree.n, actualDepth) == qtd)
            newLine = true;

        if (actual == NULL)
        {
            os << "{}";
            if (newLine)
            {
                actualDepth++;
                qtd = 0;
                os << endl;
            }

            continue;
        }

        Node** children = actual->getChildren();
        for (int n = 0; n < tree.n; n++)
            sequence.push(children[n]);

        os << *actual;

        if (newLine)
        {
            actualDepth++;
            qtd = 0;
            os << endl;
        }
    }

    return os;
}
