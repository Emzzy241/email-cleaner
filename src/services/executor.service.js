const executeCleanup = async (
    emails,
    gmail,
    deleteEmail
) => {

    const result = {
        requested: emails.length,
        deleted: 0,
        failed: 0,
        failures: []
    };

    for (const email of emails) {

        try {

            await deleteEmail(
                email.id,
                gmail
            );

            result.deleted++;

        } catch (error) {

            result.failed++;

            result.failures.push({
                id: email.id,
                reason: error.message
            });
        }
    }

    return result;
};

module.exports = {
    executeCleanup
};


// const executeCleanup = async (
//     emails,
//     gmail,
//     deleteEmail
// ) => {

//     const result = {
//         requested: emails.length,
//         deleted: 0,
//         failed: 0,
//         failures: []
//     };

//     for (const email of emails) {

//         try {

//             await deleteEmail(
//                 email.id,
//                 gmail
//             );

//             result.deleted++;

//         } catch (error) {

//             result.failed++;

//             result.failures.push({
//                 id: email.id,
//                 reason: error.message
//             });
//         }
//     }

//     return result;
// };

// module.exports = {
//     executeCleanup
// };