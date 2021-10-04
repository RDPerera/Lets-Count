

def naiveSearch(text, pattern):
    n = len(text)
    m = len(pattern)
    output = ""

    i = 0
    j = 0

    while i < (n - m + 1):
        while j < m and (text[i + j] == pattern[j] or pattern[j] == "_"):
            j += 1

        if(j == m and m != 0):
            output += "Pattern Found!   Position: " + str(i) + "\n"
        i += 1
        j = 0

    if not output:
        output = "Not Found Any Pattern!"

    return output


num = input("Enter File No: ")
textName = "text/text" + num + ".txt"
patternName = "pattern/pattern" + num + ".txt"
outputName = "output/patternmatch" + num + ".output" + ".txt"


textFile = open(textName, "r")
patternFile = open(patternName, "r")
outputFile = open(outputName, "w")

outputFile.write(naiveSearch(textFile.read(), patternFile.read()))

textFile.close()
patternFile.close()
outputFile.close()
