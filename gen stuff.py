





count = 10
n = 1

# n% {background-postition: 160*n-1}
while n <= count:
    print(str(n*10) + "% {background-position: " + str(-1*160*(n-1)) + "px}")
    n += 1
