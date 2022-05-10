import getPostById from "./autoposter/getPostById";
import send from "./postSender";

// For testing purposes
getPostById(process.argv[2]).then(post => {
    if (post) {
        send(post);
    }
});
