const { executeCleanup } = require("../services/executor.service");
const gmailService = require("../services/gmail.service");
const prisma = require("../config/prisma");

const getEmails = async (req, res) => {
    try {
        const userId = req.user?.id || 1; // temporary fallback

        // 1. Get Gmail client (already DB-backed + OAuth handled)
        const gmail = await gmailService.getGmailClient(userId);

        // 2. Fetch message IDs
        const response = await gmail.users.messages.list({
            userId: "me",
            maxResults: 200
        });

        const messages = response.data.messages || [];

        // 3. Transform into FULL email objects using your service
        const emails = await gmailService.getEmails(messages, gmail);

        return res.json({
            message: "Emails fetched successfully",
            count: emails.length,
            messages: emails
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch emails",
            error: error.message
        });
    }
};

const cleanupEmails = async (req, res) => {
    // console.log("checking execute cleanup value: " + executeCleanup);

    try {

        // Adding a dry run to confirm before execution.
        const dryRun = req.query.dryRun === "true";

        const userId = req.user?.id || 1;
            console.log(userId);

        const gmail =
            await gmailService
                .getGmailClient(userId);

        const response =
            await gmail.users.messages.list({
                userId: "me",
                maxResults: 20
            });

        const messages =
            response.data.messages || [];

        const emails =
            await gmailService.getEmails(
                messages,
                gmail
            );


        // console.log(job);

        const deletable =
            emails.filter(
                email =>
                    email.recommendedAction
                    === "DELETE" || email.recommendedAction === "REVIEW"
            )
                .splice(0, 10);
        if (dryRun) {
            return res.json({
                mode: "DRY_RUN ---  \n Down below is a list of emails that are deletable based on already defined rules \n (where recommendedAction = REVIEW OR DELETE)",
                requested:
                    deletable.length,
                emails:
                    deletable
            });
        }

        const result =
            await executeCleanup(
                deletable,
                gmail,
                gmailService.deleteEmail
            );
        // console.log(emails);
        console.log(prisma);
        console.log(prisma.cleanupJob);

        const job = await prisma.cleanupJob.create({
            data: {
                status: "PENDING",
                requested: deletable.length,
                userId
            }
        });

        setImmediate(async () => {
            try {
                const result = await executeCleanup(
                    deletable,
                    gmail,
                    gmailService.deleteEmail
                );

                await prisma.cleanupJob.update({
                    where: { id: job.id },
                    data: {
                        status: "COMPLETED",
                        deleted: result.deleted,
                        failed: result.failed
                    }
                });
            } catch (bgError) {
                console.error("Background cleanup failed for job " + job.id, bgError);
                await prisma.cleanupJob.update({
                    where: { id: job.id },
                    data: { status: "FAILED" }
                }).catch(err => console.error("Failed to mark job as failed", err));
            }
        });

        return res.status(202).json({
            message: "Cleanup started",
            jobId: job.id,
            status: job.status
        });
    } catch (error) {

        return res.status(500).json({
            message:
                "Cleanup failed",
            error:
                error.message
        });
    }
};

const getCleanupStatus = async (req, res) => {
        const job =
            await prisma.cleanupJob.findUnique({
                where: {
                    id:
                        Number(req.params.id)
                }
            });
        return res.json(job);
};

const getAllCleanupStatus = async (req, res) => {
    const result = await prisma.cleanupJob.findMany();
    return res.json(result);
}

const cleanupOldEmails = async (req, res) => {
    try {
        const dryRun = req.query.dryRun === "true";
        
        const userId = req.user?.id || 1;
        
        const gmail = await gmailService.getGmailClient(userId);
        
        const START_YEAR = 2021;
        const END_YEAR = 2024;
        
        const response = await gmail.users.messages.list({
            userId: "me",
            maxResults: 100,
            q: `after:${START_YEAR}/01/01 before:${END_YEAR + 1}/01/01`
        });
        
        const messages = response.data.messages || [];
        
        const emails = await gmailService.getEmails(messages, gmail);
        console.log(emails);
        
        
        // NOt needed since gmail provides a query q feature.
        const inYearRange = emails.filter(email => {
            const year = new Date(Number(email.internalDate)).getFullYear(); 
            return year >= START_YEAR && year <= END_YEAR; });
        
        // const deletable = 
        //     emails.filter(
        //         email => email.recommendedAction === "DELETE" || email.recommendedAction === "REVIEW"
        //     )
        const deletable = emails.filter(email => {
            // Safe parsing for internalDate string or object
            const timestamp = typeof email.internalDate === 'string' ? Number(email.internalDate) : email.internalDate;
            const year = new Date(timestamp).getFullYear(); 
            
            const matchesYear = year >= START_YEAR && year <= END_YEAR;
            const isDeletableAction = email.recommendedAction === "DELETE" || email.recommendedAction === "REVIEW";
            
            return matchesYear && isDeletableAction;
        });
            // emails.filter(
            //     email => email.recommendedAction === "DELETE" || email.recommendedAction === "REVIEW" || email.recommendedAction === "KEEP"
            // )
        
            if (dryRun) {
                return res.json({
                    mode: "DRY_RUN",
                    message: `Emails from ${START_YEAR} - ${END_YEAR} marked for deletion`,
                    requested: deletable.length,
                    emails: deletable
                });
            }

            const result = await executeCleanup(deletable, gmail, gmailService.deleteEmail);

            return res.status(200).json({
                mode: "DELETING OLD EMAILS",
                message: `Emails from ${START_YEAR} - ${END_YEAR} has been cleaned up`,
                ...result
            });            
        
    } catch (error) {
        return res.status(500).json({
            message: "Old Emails Clean Up failed",
            error: error.message
        })
    }
}

module.exports = { getEmails, cleanupEmails, cleanupOldEmails,  getCleanupStatus, getAllCleanupStatus };
