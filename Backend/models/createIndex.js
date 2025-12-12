const client = require("../config/elasticsearch");

async function createIndex() {
  await client.indices.create({
    index: "appointments",
    body: {
      mappings: {
        properties: {
          appointmentTypes: { type: "text" },
          doctorName: { type: "text" },
          reason: { type: "text" },
          BookDate: { type: "date" },
          userId: { type: "keyword" },
          startTime: { type: "text" },
          status: { type: "keyword" }
        }
      }
    }
  });

  console.log("Index created");
}

createIndex();
