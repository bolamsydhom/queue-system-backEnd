var mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
const customerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.ObjectId,
    ref: "User",
  },
  queueNumber: {
    type: Number
  },
  isActual: {
    type: Boolean
  },
  securityCode: {
    type: Number
  }
});
const queueSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.ObjectId,
    ref: "Organization",
    required: true,
  },
  branchId: {
    type: mongoose.ObjectId,
    ref: "Branch",
    required: true,
  },
  service: serviceSchema,
  // services: {
  //   type: mongoose.ObjectId,
  //   ref: "serviceSchema",
  // },
  cityId: {
    type: mongoose.ObjectId,
    ref: "City",
    required: true,
  },

  customers: [customerSchema],

  
  securityCodes: {
    type: [Number]
  }
}, {
  timestamps: true,
});
queueSchema.set("toJSON", {
  virtuals: true,
});

const Queue = mongoose.model("Queue", queueSchema);

module.exports = Queue;