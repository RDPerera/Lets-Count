#include <typeinfo>
#include <stdexcept>
#include "Info.h"
#include "MyInfo.h"

MyInfo::MyInfo(int i)
{
    this->info = i;
}

Info* MyInfo::clone()
{
    MyInfo* n = new MyInfo(this->info);
    return n;
}

int MyInfo::compareTo(Info* info)
{
    if (typeid(*info) != typeid(*this))
        throw invalid_argument("The parameter must be an MyInfo instance");

    MyInfo* i = (MyInfo*)info;

    if (this->info > i->info)
        return 1;
    else if (this->info < i->info)
        return -1;

    return 0;
}

int MyInfo::getInfo()
{
    return this->info;
}

void MyInfo::print(ostream& os)
{
    os << this->info;
}
