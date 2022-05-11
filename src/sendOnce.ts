import getPostById from "./autoposter/getPostById";
import send from "./postSender";

// For testing purposes
(async () => {
    const id = process.argv[2]
    const post = await getPostById(id)
    if (post) {
        await send(post);
    } else {
        console.error(`No post with id ${id} found`)
        console.error(post)
    }
})();
