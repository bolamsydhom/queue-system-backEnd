var mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const ticketSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.ObjectId,
      ref: "User",
      required: true,
    },

    brancdID: {
      type: mongoose.ObjectId,
      ref: "Branch",
      required: true,
    },
    // deptID: {
    //     type: mongoose.ObjectId,
    //     ref: 'Department',
    //     required: true
    // },
    cityId: {
      type: mongoose.ObjectId,
      ref: "City",
      required: true,
    },
    areaId: {
      type: mongoose.ObjectId,
      ref: "Area",
      required: true,
    },
    companyId: {
      type: mongoose.ObjectId,
      ref: "Organization",
      required: true,
    },
    services: [serviceSchema],
    queueNumber: {
      type: Number,
    },

    estimatedTime: {
      type: Number,
      required: true,
    },
    securityCode: {
      type: String,
      required: true,
    },
    isDelayed: {
      type: Boolean,
    },
    isNotShow: {
      type: Boolean,
    },
    isCanceled: {
      type: Boolean,
    },
    isRescheduled: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

ticketSchema.set("toJSON", {
  virtuals: true,
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
