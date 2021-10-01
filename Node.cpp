#include <sstream>
#include <stdexcept>
#include "Node.h"

using namespace std;

Node::Node(unsigned int n)
{
    this->order = n;
    this->elements = 0;

    this->infoArr = new Info*[n - 1];
    this->ptrArr = new Node*[n];

    for (int i = 0; i < this->order; i++)
        this->ptrArr[i] = NULL;
}

void Node::addInfo(Info* i)
{
    int n = 0;
    for (; n < this->elements; n++)
        if (this->infoArr[n]->compareTo(i) == 0)
            throw std::invalid_argument("Elements cannot be equal");
        else if (this->infoArr[n]->compareTo(i) > 0)
            break;

    if (this->elements == this->order - 1) //The info array is full
    {
        //n is the index of the pointer array
        if (this->ptrArr[n] == NULL)
            this->ptrArr[n] = new Node(this->order);

        this->ptrArr[n]->addInfo(i);
    }
    else //There's space in the info array
    {
        if (n < this->elements) //The array need to be shifted
            for (int j = this->elements; j > n; j--)
                this->infoArr[j] = this->infoArr[j - 1];

        this->infoArr[n] = i;
        this->elements++;
    }
}

void Node::removeInfo(Info* i)
{
    int n = 0;
    for (; n < this->elements; n++)
        if (this->infoArr[n]->compareTo(i) >= 0)
            break;

    if (this->elements == this->order - 1 && !this->isLeaf()) //The info array is full and has children
    {
        if (((n < this->elements && this->infoArr[n]->compareTo(i) > 0) || n >= this->elements) && this->ptrArr[n] != NULL) //The info is in the nth pointer
        {
            this->ptrArr[n]->removeInfo(i);
            this->clearNode(n);
        }
        else if (n < this->elements && this->infoArr[n]->compareTo(i) == 0) //The info is in this node
        {
            delete this->infoArr[n];

            if (this->ptrArr[n] != NULL)
            {
                this->infoArr[n] = this->ptrArr[n]->popMax();
                this->clearNode(n);
            }
            else if (this->ptrArr[n + 1] != NULL)
            {
                this->infoArr[n] = this->ptrArr[n + 1]->popMin();
                this->clearNode(n + 1);
            }
            else
            {
                //Searches a child in the left first
                int i = n - 1;
                for (; i >= 0; i--)
                    if (this->ptrArr[i] != NULL) //We've found a valid child
                        break;

                if (i != -1) //There is a child to the left
                {
                    for (int j = n; j >= i; j--) //Shifts the elements to the right
                        this->infoArr[j] = this->infoArr[j - 1];

                    this->infoArr[i] = this->ptrArr[i]->popMax();
                    this->clearNode(i);
                }
                else
                {
                    //There is no child to the left, so we search the right
                    i = n + 1;
                    for (; i < this->order; i++)
                        if (this->ptrArr[i] != NULL) //We've found a valid child
                            break;

                    for (int j = n; j < i - 1; j++) //Shifts the elements to the left
                        this->infoArr[j] = this->infoArr[j + 1];

                    this->infoArr[i - 1] = this->ptrArr[i]->popMin();
                    this->clearNode(i);
                }
            }
        }
    }
    else //The info array isn't full or it's a leaf, so the node can't have children
        if (this->infoArr[n]->compareTo(i) == 0) //The element is what we want to remove
        {
            delete this->infoArr[n];
            this->elements--;

            //Shifts the array
            for (int j = n; j < this->elements; j++)
                this->infoArr[j] = this->infoArr[j + 1];
        }
}

Info* Node::popMax()
{
    Info* i;
    if (this->ptrArr[this->order - 1] != NULL)
    {
        i = this->ptrArr[this->order - 1]->popMax();
        this->clearNode(this->order - 1);
    }
    else
    {
        i = this->infoArr[this->elements - 1]->clone();
        this->removeInfo(i);
    }

    return i;
}

Info* Node::popMin()
{
    Info* i;
    if (this->ptrArr[0] != NULL)
    {
        i = this->ptrArr[0]->popMin();
        this->clearNode(0);
    }
    else
    {
        i = this->infoArr[0]->clone();
        this->removeInfo(i);
    }

    return i;
}

bool Node::isLeaf()
{
    if (this->elements < this->order - 1)
        return true;

    bool leaf = true;
    for (int n = 0; n < this->order; n++)
        if (this->ptrArr[n] != NULL)
        {
            leaf = false;
            break;
        }

    return leaf;
}

int Node::getInfoAmount()
{
    return this->elements;
}

Node** Node::getChildren()
{
    return this->ptrArr;
}

string Node::preorder()
{
    stringstream ss;
    if (this->elements != this->order - 1) //The info array isn't full, so it can't have any children
        for (int n = 0; n < this->elements; n++)
        {
            this->infoArr[n]->print(ss);
            ss << ", ";
        }
    else
    {
        for (int n = 0; n < this->order - 1; n++)
        {
            this->infoArr[n]->print(ss);
            ss << ", ";

            if (this->ptrArr[n] != NULL)
                ss << this->ptrArr[n]->preorder();
        }

        if (this->ptrArr[this->order - 1] != NULL)
            ss << this->ptrArr[this->order - 1]->preorder();
    }

    return ss.str();
}

string Node::inorder()
{
    stringstream ss;
    if (this->elements != this->order - 1) //The info array isn't full, so it can't have any children
        for (int n = 0; n < this->elements; n++)
        {
            this->infoArr[n]->print(ss);
            ss << ", ";
        }
    else
    {
        for (int n = 0; n < this->order - 1; n++)
        {
            if (this->ptrArr[n] != NULL)
                ss << this->ptrArr[n]->inorder();

            this->infoArr[n]->print(ss);
            ss << ", ";
        }

        if (this->ptrArr[this->order - 1] != NULL)
            ss << this->ptrArr[this->order - 1]->inorder();
    }

    return ss.str();
}

string Node::postorder()
{
    stringstream ss;
    if (this->elements != this->order - 1) //The info array isn't full, so it can't have any children
        for (int n = 0; n < this->elements; n++)
        {
            this->infoArr[n]->print(ss);
            ss << ", ";
        }
    else
    {
        if (this->ptrArr[0] != NULL)
            ss << this->ptrArr[0]->postorder();

        for (int n = 0; n < this->order - 1; n++)
        {
            if (this->ptrArr[n + 1] != NULL)
                ss << this->ptrArr[n + 1]->postorder();

            this->infoArr[n]->print(ss);
            ss << ", ";
        }
    }

    return ss.str();
}

ostream& operator<<(ostream& os, const Node& node)
{
    os << "{ ";
    if (node.elements > 0)
        node.infoArr[0]->print(os);

    for (int n = 1; n < node.elements; n++)
    {
        os << ", ";
        node.infoArr[n]->print(os);
    }

    /*os << "], children: [";
    if (node.ptrArr[0] != NULL)
        os << *node.ptrArr[0];
    else
        os << "{}";

    for (int n = 1; n < node.order; n++)
        if (node.ptrArr[n] != NULL)
            os << ", " << *node.ptrArr[n];
        else
            os << ", {}";

    os << "] }";*/
    os << " }";
    return os;
}

void Node::clearNode(unsigned int n)
{
    if (this->ptrArr[n] != NULL && this->ptrArr[n]->getInfoAmount() == 0)
    {
        delete this->ptrArr[n];
        this->ptrArr[n] = NULL;
    }
}
