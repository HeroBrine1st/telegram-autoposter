import getPostById from "./autoposter/getPostById";
import send from "./postSender";

// For testing purposes
(async () => {
    const post = await getPostById(process.argv[2])
    if (post) {
        send(post);
    }
})();
