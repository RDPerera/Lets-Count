#ifndef _MYINFO_INCLUDED_

#define _MYINFO_INCLUDED_
#include "Info.h"

class MyInfo : public Info
{
    public:
        MyInfo(int);
        Info* clone();
        int compareTo(Info*);
        int getInfo();
        void print(ostream&);

    private:
        int info;
};

#endif
