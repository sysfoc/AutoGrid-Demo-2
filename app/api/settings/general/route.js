import dbConnect from "../../../lib/mongodb";
import GeneralSettings from "../../../models/settings/General";
import { NextResponse } from "next/server";

const validateSettingsInput = (data) => {
  const errors = [];

  if (data.logo1 && typeof data.logo1 !== "string") {
    errors.push("Logo 1 must be a valid string path");
  }
  if (data.logo2 && typeof data.logo2 !== "string") {
    errors.push("Logo 2 must be a valid string path");
  }
  if (data.logo3 && typeof data.logo3 !== "string") {
    errors.push("Logo 3 must be a valid string path");
  }
  if (data.logo4 && typeof data.logo4 !== "string") {
    errors.push("Logo 4 must be a valid string path");
  }
  if (data.logo5 && typeof data.logo5 !== "string") {
    errors.push("Logo 5 must be a valid string path");
  }
  if (data.logo6 && typeof data.logo6 !== "string") {
    errors.push("Logo 6 must be a valid string path");
  }
  if (
    data.activeWebsiteLogo !== undefined &&
    !["logo1", "logo2", "logo3", "logo4", "logo5", "logo6"].includes(
      data.activeWebsiteLogo,
    )
  ) {
    errors.push(
      'Active website logo must be one of "logo1", "logo2", "logo3", "logo4", "logo5", or "logo6"',
    );
  }
  if (data.favicon && typeof data.favicon !== "string") {
    errors.push("Favicon must be a valid string path");
  }

  if (data.top) {
    if (typeof data.top !== "object") {
      errors.push("Top section must be an object");
    } else {
      if (
        data.top.hideDarkMode !== undefined &&
        typeof data.top.hideDarkMode !== "boolean"
      ) {
        errors.push("hideDarkMode must be a boolean");
      }
      if (
        data.top.hideFavourite !== undefined &&
        typeof data.top.hideFavourite !== "boolean"
      ) {
        errors.push("hideFavourite must be a boolean");
      }
      if (
        data.top.hideLogo !== undefined &&
        typeof data.top.hideLogo !== "boolean"
      ) {
        errors.push("hideLogo must be a boolean");
      }
    }
  }

  if (data.footer) {
    if (typeof data.footer !== "object") {
      errors.push("Footer section must be an object");
    } else {
      ["col1Heading", "col2Heading", "col3Heading"].forEach((field) => {
        if (
          data.footer[field] !== undefined &&
          typeof data.footer[field] !== "string"
        ) {
          errors.push(`${field} must be a string`);
        }
      });
    }
  }

  if (data.recaptcha) {
    if (typeof data.recaptcha !== "object") {
      errors.push("Recaptcha section must be an object");
    } else {
      if (
        data.recaptcha.siteKey !== undefined &&
        typeof data.recaptcha.siteKey !== "string"
      ) {
        errors.push("Recaptcha siteKey must be a string");
      }
      if (
        data.recaptcha.status !== undefined &&
        !["active", "inactive"].includes(data.recaptcha.status)
      ) {
        errors.push('Recaptcha status must be either "active" or "inactive"');
      }
    }
  }

  if (data.analytics) {
    if (typeof data.analytics !== "object") {
      errors.push("Analytics section must be an object");
    } else {
      if (
        data.analytics.trackingId !== undefined &&
        typeof data.analytics.trackingId !== "string"
      ) {
        errors.push("Analytics trackingId must be a string");
      }
      if (
        data.analytics.status !== undefined &&
        !["active", "inactive"].includes(data.analytics.status)
      ) {
        errors.push('Analytics status must be either "active" or "inactive"');
      }
    }
  }

  if (data.cookieConsent) {
    if (typeof data.cookieConsent !== "object") {
      errors.push("Cookie consent section must be an object");
    } else {
      const stringFields = [
        "message",
        "buttonText",
        "textColor",
        "bgColor",
        "buttonTextColor",
        "buttonBgColor",
      ];
      stringFields.forEach((field) => {
        if (
          data.cookieConsent[field] !== undefined &&
          typeof data.cookieConsent[field] !== "string"
        ) {
          errors.push(`Cookie consent ${field} must be a string`);
        }
      });

      const colorFields = [
        "textColor",
        "bgColor",
        "buttonTextColor",
        "buttonBgColor",
      ];
      colorFields.forEach((field) => {
        if (
          data.cookieConsent[field] &&
          !/^#[0-9A-Fa-f]{6}$/.test(data.cookieConsent[field])
        ) {
          errors.push(
            `Cookie consent ${field} must be a valid hex color (e.g., #000000)`,
          );
        }
      });

      if (
        data.cookieConsent.status !== undefined &&
        !["active", "inactive"].includes(data.cookieConsent.status)
      ) {
        errors.push(
          'Cookie consent status must be either "active" or "inactive"',
        );
      }
    }
  }

  if (data.themeColor) {
    if (typeof data.themeColor !== "object") {
      errors.push("Theme color section must be an object");
    } else {
      const colorFields = ["darkModeBg", "darkModeText"];
      colorFields.forEach((field) => {
        if (data.themeColor[field] !== undefined) {
          if (typeof data.themeColor[field] !== "string") {
            errors.push(`Theme color ${field} must be a string`);
          } else if (!/^#[0-9A-Fa-f]{6}$/.test(data.themeColor[field])) {
            errors.push(
              `Theme color ${field} must be a valid hex color (e.g., #000000)`,
            );
          }
        }
      });
    }
  }

  return errors;
};

const sanitizeInput = (data) => {
  const sanitized = { ...data };

  if (sanitized.logo1) sanitized.logo1 = sanitized.logo1.trim();
  if (sanitized.logo2) sanitized.logo2 = sanitized.logo2.trim();
  if (sanitized.logo3) sanitized.logo3 = sanitized.logo3.trim();
  if (sanitized.logo4) sanitized.logo4 = sanitized.logo4.trim();
  if (sanitized.logo5) sanitized.logo5 = sanitized.logo5.trim();
  if (sanitized.logo6) sanitized.logo6 = sanitized.logo6.trim();
  if (sanitized.favicon) sanitized.favicon = sanitized.favicon.trim();

  if (sanitized.footer) {
    Object.keys(sanitized.footer).forEach((key) => {
      if (typeof sanitized.footer[key] === "string") {
        sanitized.footer[key] = sanitized.footer[key].trim();
      }
    });
  }

  if (sanitized.recaptcha?.siteKey) {
    sanitized.recaptcha.siteKey = sanitized.recaptcha.siteKey.trim();
  }

  if (sanitized.analytics?.trackingId) {
    sanitized.analytics.trackingId = sanitized.analytics.trackingId.trim();
  }

  if (sanitized.cookieConsent) {
    Object.keys(sanitized.cookieConsent).forEach((key) => {
      if (typeof sanitized.cookieConsent[key] === "string") {
        sanitized.cookieConsent[key] = sanitized.cookieConsent[key].trim();
      }
    });
  }

  return sanitized;
};

export async function GET() {
  try {
    const dbConnection = await dbConnect();
    if (!dbConnection) {
      console.error("Database connection failed");
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 },
      );
    }

    const settings = await GeneralSettings.findOne();

    if (!settings) {
      const defaultSettings = {
        logo1: "",
        logo2: "",
        logo3: "",
        logo4: "",
        logo5: "",
        logo6: "",
        activeWebsiteLogo: "logo1",
        favicon: "",
        top: {
          hideDarkMode: false,
          hideFavourite: false,
          hideLogo: false,
        },
        footer: {
          col1Heading: "",
          col2Heading: "",
          col3Heading: "",
        },
        recaptcha: {
          siteKey: "",
          status: "inactive",
        },
        analytics: {
          trackingId: "",
          status: "inactive",
        },
        cookieConsent: {
          message: "",
          buttonText: "ACCEPT",
          textColor: "#000000",
          bgColor: "#ffffff",
          buttonTextColor: "#ffffff",
          buttonBgColor: "#000000",
          status: "inactive",
        },
        themeColor: {
          darkModeBg: "#000000",
          darkModeText: "#ffffff",
        },
      };

      return NextResponse.json({
        settings: defaultSettings,
        isDefault: true,
      });
    }

    return NextResponse.json({
      settings,
      isDefault: false,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);

    if (error.name === "MongooseError" || error.name === "MongoError") {
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const dbConnection = await dbConnect();
    if (!dbConnection) {
      console.error("Database connection failed");
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 },
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("Invalid JSON in request body:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON format in request body" },
        { status: 400 },
      );
    }

    if (!body || Object.keys(body).length === 0) {
      console.error("Empty request body received");
      return NextResponse.json(
        { error: "Request body cannot be empty" },
        { status: 400 },
      );
    }

    const validationErrors = validateSettingsInput(body);
    if (validationErrors.length > 0) {
      console.error("Validation errors:", validationErrors);
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationErrors,
        },
        { status: 400 },
      );
    }

    const sanitizedData = sanitizeInput(body);

    let settings = await GeneralSettings.findOne();

    if (settings) {
      const currentSettingsObject = settings.toObject();
      const comparableCurrentSettings = {
        ...currentSettingsObject,
        createdAt: undefined,
        updatedAt: undefined,
        __v: undefined,
        _id: undefined,
        logo1: currentSettingsObject.logo1 || "",
        logo2: currentSettingsObject.logo2 || "",
        logo3: currentSettingsObject.logo3 || "",
        logo4: currentSettingsObject.logo4 || "",
        logo5: currentSettingsObject.logo5 || "",
        logo6: currentSettingsObject.logo6 || "",
        activeWebsiteLogo: currentSettingsObject.activeWebsiteLogo || "logo1",
      };

      const comparableSanitizedData = {
        ...sanitizedData,
        logo1: sanitizedData.logo1 || "",
        logo2: sanitizedData.logo2 || "",
        logo3: sanitizedData.logo3 || "",
        activeWebsiteLogo: sanitizedData.activeWebsiteLogo || "logo1",
      };

      const hasChanges =
        JSON.stringify(comparableSanitizedData) !==
        JSON.stringify(comparableCurrentSettings);

      if (!hasChanges) {
        return NextResponse.json({
          success: true,
          settings,
          message: "No changes detected",
        });
      }

      settings = await GeneralSettings.findOneAndUpdate(
        {},
        {
          $set: {
            ...sanitizedData,
            updatedAt: new Date(),
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!settings) {
        console.error("Failed to update settings");
        return NextResponse.json(
          { error: "Failed to update settings" },
          { status: 500 },
        );
      }
    } else {
      try {
        settings = await GeneralSettings.create({
          ...sanitizedData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } catch (createError) {
        console.error("Error creating settings:", createError);

        if (createError.name === "ValidationError") {
          const validationErrors = Object.values(createError.errors).map(
            (err) => err.message,
          );
          return NextResponse.json(
            {
              error: "Validation failed during creation",
              details: validationErrors,
            },
            { status: 400 },
          );
        }

        throw createError;
      }
    }
    return NextResponse.json({
      success: true,
      settings,
      message: "Settings saved successfully",
    });
  } catch (error) {
    console.error("Error saving settings:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message,
      );
      return NextResponse.json(
        {
          error: "Settings validation failed",
          details: validationErrors,
        },
        { status: 400 },
      );
    }

    if (error.name === "MongooseError" || error.name === "MongoError") {
      return NextResponse.json(
        { error: "Database operation failed" },
        { status: 503 },
      );
    }

    if (error.name === "CastError") {
      return NextResponse.json(
        {
          error: "Invalid data format",
          details: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to save settings",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
