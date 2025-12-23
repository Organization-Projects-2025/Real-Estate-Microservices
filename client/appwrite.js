import { Client, Storage, ID } from 'appwrite';

const client = new Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6828bce80031b31b1db7');

const storage = new Storage(client);

export { storage, ID };
