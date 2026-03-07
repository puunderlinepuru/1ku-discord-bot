cutting the forbidden messages

EXAMPLE: 

https://tenor.com/view/rich-off-airpods-richoffairpods-stack-band-bandforband-gif-43510678540525453133
12309801928567 6̷7̷ https://tenor.com/view/rich-off-airpods-richoffairpods-67-stack-band-bandforband-gif-4351078540525453133 <:silly:13153935094733867536>

check for weird Unicode
    if found:
        timeout lol
    if not:
        continue checks

in loop:
- dumb check - [check for "67" and "6 7"]
    if no 67:
        end checks
    if 67:
        check for "https://" and "<:" in message
        if found:
            continue checks
        if not:
            timeout lol

- check for link [if "http://"(?) or "https://"]
    
    cut word out - check index where https starts and find index of the first " " after it
    check if cut word contains -67- or -6-7-
    if contains:
        return timeout
    if not:
        cut message string to substirng without the word
        continue checks

- check for emoji [if "<:"]
    
    cut word out - check index where <: and find index of the first > (or " ")
    check if word contains 67
    if contains:
        find index of first :
        find index of second :
        <!-- 67 -->
        if 67 exists inside of "::":
            timeout
        if 67 exists outside of "::":
            continue
        <!-- 6 and 7 -->
        if there's 6 but no 7 within "::":
            cut message string to substring with 6 instead of the word
            continue checks
        if there's 7 but no 6 within "::":
            cut message string to substring with 7 instead of the word
            continue checks
    if not:
        cut message string to substirng without the word
        continue checks
    