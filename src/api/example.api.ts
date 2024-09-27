import { Request, Response, Router } from "express";
import { HttpError } from "../models/enum/http-errors.enum";

const router = Router();

router.get("/switchesExample", async (req: Request, res: Response) => {
    const language = req?.headers?.["accept-language"] ?? "en";

    if (language === "en" || language === "ar") {
        res.json([
            {
                "id": 1,
                "value": "Value 1"
            },
            {
                "id": 2,
                "value": "Value 2"
            },
            {
                "id": 3,
                "value": "Value 3"
            },
            {
                "id": 4,
                "value": "Value 4"
            },
            {
                "id": 5,
                "value": "Value 5"
            }
        ]);
    } else if (language === "it" || language === "es") {
        res.json([
            {
                "id": 1,
                "value": "Valore 1"
            },
            {
                "id": 2,
                "value": "Valore 2"
            },
            {
                "id": 3,
                "value": "Valore 3"
            },
            {
                "id": 4,
                "value": "Valore 4"
            },
            {
                "id": 5,
                "value": "Valore 5"
            }
        ]);
    } else {
        res
            .status(HttpError.InternalServerError)
            .send({error: "Internal Server Error", message: "An error occured during pokemon species detail retrieve"});
    }
});

router.get("/getExampleDates", async (req: Request, res: Response) => {
    res.json([
        {
            "date": "1988-12-12T16:15:00.000+02:00"
        },
        {
            "date": "1988-12-12T15:15:00.000+01:00"
        },
        {
            "date": "1988-12-12T13:15:00.000-01:00"
        }
    ]);
});

export default router;