const amqp = require("amqplib");


let connection = null;
let channel = null;

async function connectRabbit() {
  try {

      if(channel) return channel;

      connection = await amqp.connect("amqp://localhost:5672"); // correct port
      channel = await connection.createChannel();
      await channel.assertQueue("notifications" , { durable: true });
      console.log("Connected to RabbitMQ successfully");
      return channel;
  } catch (error) {
    console.error("RabbitMQ connection failed:", error.message);
  }
}

async function closeRabbit() {
  try {
    await channel.close();
    await connection.close();
  } catch (e) { /* ignore */ }
}

module.exports = { connectRabbit ,closeRabbit };
