 
import { asyncHandler } from "../utils/asyncHandler.js";
import Stripe from "stripe";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";


if(!process.env.STRIPE_SECRET_KEY){
    throw new ApiError(400,"Stripe secret key is missing ",{})

}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const CREDIT_MAP = {
    100: 50,
    200: 120,
    500: 300
};

export const createCreditsOrder = asyncHandler(async (req, res) => {
    const userId = req._id;
    const { amount } = req.body;

    if (!CREDIT_MAP[amount]) {
        throw new ApiError(400, "Invalid credit plan", {});
    }

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],

        success_url: `${process.env.CLIENT_URL}/payment-success`,
        cancel_url: `${process.env.CLIENT_URL}/payment-failed`,

        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: `${CREDIT_MAP[amount]} Credits`,
                    },
                    unit_amount: amount * 100,
                },
                quantity: 1,
            },
        ],

        metadata: {
            userId: userId,
            credits: CREDIT_MAP[amount],
        },
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                session.url,
                "Checkout URL fetched successfully"
            )
        )
})


export const stripeWebhook = asyncHandler(async(req ,res)=>{

    const sig = req.headers["stripe-signature"]
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error) {
         throw new ApiError(400,"WEBHOOK ERROR",error)
        
    } 
    if(event.type === "checkout.session.completed"){
        const session = event.data.object

        const userId = session.metadata.userId
        const creditsToAdd = Number(session.metadata.credits)

        if(!userId || !creditsToAdd){
            throw new ApiError(400,"Invalid metadata",{})
        }

        const user = await User.findByIdAndUpdate(userId,{
            $inc:{ credits: creditsToAdd},
            $set:{ isCreditAvailable:true},
        },{ new:true})

    }
     return res.
        status(200).
        json(new ApiResponse(200,{received:true},"Successfull"))
})
