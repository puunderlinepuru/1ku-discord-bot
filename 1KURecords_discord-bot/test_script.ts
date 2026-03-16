const readline = require('readline-sync');

let text: string = "";
while (text != "exit") {
    text = readline.question();
    console.log("Processed text: " + process_text(text));
}

function process_text(text: string) {
    check_for_67(text);

    let processed_content = text.trim().toLowerCase();
    processed_content = processed_content.replace(/[^/a-z0-9@:<>-]/g, '');

    return processed_content;
}



function check_for_67(message: string) {
    let message_content: string = message.toLowerCase();

    if (
        ((message_content.includes('6') && message_content.includes('7')) ||
        (message_content.includes('six') && message_content.includes('seven')))
    ) {
        console.log(`[67_MESSAGE] Content: \n ${message_content}`);

        // Pass if gif or link
        if (message_content.includes('http') && !message_content.includes('-67-')) {
            message_content = message_content.replace(/https?:\/\/[^\s]+/g, '')[0];
            console.log('link detected, new content: \n' + message_content);
        }

        // Pass if mention
        if (message_content.includes('<@')) {
            message_content = message_content.substring(message_content.indexOf('>') + 1);
            console.log(`Mention detected. New content: \n ${message_content}`);
            if (!(
                message_content.includes('67') ||
                message_content.includes('6 7') || 
                message_content.includes('₆₇') ||
                message_content.includes('six seven') ||
                message_content.includes('sixseven') ||
                message_content.includes(':six::seven:') ||
                message_content.includes(':six: :seven:')
            )) {return;}
        }
        return true;
    } else {
        return false;
    }
}
