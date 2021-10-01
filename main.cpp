#include <stdio.h>
#include <iostream>
#include <stdexcept>
#include "MyInfo.h"
#include "BTree.h"

using namespace std;

int main()
{
    try
    {
        BTree* tree = new BTree(4);

        int n;
        char c;
        scanf("%c %i%*c", &c, &n);
        while (n != 1337)
        {
            MyInfo* i = new MyInfo(n);

            if (c == 'a')
                tree->add(i);
            else if (c == 'r')
                tree->remove(i);

            cout << *tree << endl;
            cout << "Pre order: " << tree->preorder();
            cout << "In order: " << tree->inorder();
            cout << "Post order: " << tree->postorder();
            cout << endl;
            scanf("%c %i%*c", &c, &n);
        }
    }
    catch (invalid_argument err)
    {
        cerr << err.what();
    }

    return 0;
}
