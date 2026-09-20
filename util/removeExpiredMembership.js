const Member = require("../models/member.js");
const { stack } = require("../routes/membership");

const handleExpiry = async() => {
    const currDate = new Date();
    await Member.updateMany(
        {
            membership : {$ne : null},
            membershipEndDate : {$lt : currDate},
            status : "active",
        },
        {
            membership : null,
            membershipStartDate : null,
            membershipEndDate : null,
            status : "inactive",
        }
    );
}

module.exports = handleExpiry;
