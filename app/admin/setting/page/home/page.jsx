"use client";
import { useState, useRef } from "react";
import { Button, Textarea, TextInput, Select, Label } from "flowbite-react";
import Swal from "sweetalert2";
const Page = () => {
  const [activeSection, setActiveSection] = useState("SEO Section");
  const [isSaving, setIsSaving] = useState(false);
  const sections = [
    "SEO Section",
    "Search Section",
    // "Brand Section",
    "Listing Section",
    // "Chooseus Section",
    "Footer",
  ];
  const refs = {
    title: useRef(null),
    metaDescription: useRef(null),
    searchMainHeading: useRef(null),
    searchSubheading: useRef(null),
    searchDescriptionText: useRef(null),
    brandHeading: useRef(null),
    brandDescription: useRef(null),
    brandStatus: useRef(null),
    listingHeading: useRef(null),
    listingStatus: useRef(null),
    chooseusFirstHeading: useRef(null),
    chooseusFirstDescription: useRef(null),
    chooseusFirstButtonText: useRef(null),
    chooseusFirstLink: useRef(null),
    chooseusSecondHeading: useRef(null),
    chooseusSecondDescription: useRef(null),
    chooseusSecondButtonText: useRef(null),
    chooseusSecondLink: useRef(null),
    chooseusThirdHeading: useRef(null),
    chooseusThirdDescription: useRef(null),
    chooseusThirdButtonText: useRef(null),
    chooseusThirdLink: useRef(null),
    chooseusFourthHeading: useRef(null),
    chooseusFourthDescription: useRef(null),
    chooseusFourthButtonText: useRef(null),
    chooseusFourthLink: useRef(null),
    mondayHr: useRef(null),
    tuesdayHr: useRef(null),
    wednesdayHr: useRef(null),
    thursdayHr: useRef(null),
    fridayHr: useRef(null),
    saturdayHr: useRef(null),
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData();
    formData.append("seoTitle", refs.title.current?.value || "");
    formData.append(
      "seoDescription",
      refs.metaDescription.current?.value || "",
    );
    formData.append(
      "searchMainHeading",
      refs.searchMainHeading.current?.value || "",
    );
    formData.append(
      "searchSubheading",
      refs.searchSubheading.current?.value || "",
    );
    formData.append(
      "searchDescriptionText",
      refs.searchDescriptionText.current?.value || "",
    );
    formData.append("brandHeading", refs.brandHeading.current?.value || "");
    formData.append(
      "brandDescription",
      refs.brandDescription.current?.value || "",
    );
    formData.append("brandStatus", refs.brandStatus.current?.value || "");
    formData.append("listingHeading", refs.listingHeading.current?.value || "");
    formData.append("listingStatus", refs.listingStatus.current?.value || "");
    formData.append(
      "chooseusFirstHeading",
      refs.chooseusFirstHeading.current?.value || "",
    );
    formData.append(
      "chooseusFirstDescription",
      refs.chooseusFirstDescription.current?.value || "",
    );
    formData.append(
      "chooseusFirstButtonText",
      refs.chooseusFirstButtonText.current?.value || "",
    );
    formData.append(
      "chooseusFirstLink",
      refs.chooseusFirstLink.current?.value || "",
    );
    formData.append(
      "chooseusSecondHeading",
      refs.chooseusSecondHeading.current?.value || "",
    );
    formData.append(
      "chooseusSecondDescription",
      refs.chooseusSecondDescription.current?.value || "",
    );
    formData.append(
      "chooseusSecondButtonText",
      refs.chooseusSecondButtonText.current?.value || "",
    );
    formData.append(
      "chooseusSecondLink",
      refs.chooseusSecondLink.current?.value || "",
    );
    formData.append(
      "chooseusThirdHeading",
      refs.chooseusThirdHeading.current?.value || "",
    );
    formData.append(
      "chooseusThirdDescription",
      refs.chooseusThirdDescription.current?.value || "",
    );
    formData.append(
      "chooseusThirdButtonText",
      refs.chooseusThirdButtonText.current?.value || "",
    );
    formData.append(
      "chooseusThirdLink",
      refs.chooseusThirdLink.current?.value || "",
    );
    formData.append(
      "chooseusFourthHeading",
      refs.chooseusFourthHeading.current?.value || "",
    );
    formData.append(
      "chooseusFourthDescription",
      refs.chooseusFourthDescription.current?.value || "",
    );
    formData.append(
      "chooseusFourthButtonText",
      refs.chooseusFourthButtonText.current?.value || "",
    );
    formData.append(
      "chooseusFourthLink",
      refs.chooseusFourthLink.current?.value || "",
    );
    formData.append("mondayHr", refs.mondayHr.current?.value || "");
    formData.append("tuesdayHr", refs.tuesdayHr.current?.value || "");
    formData.append("wednesdayHr", refs.wednesdayHr.current?.value || "");
    formData.append("thursdayHr", refs.thursdayHr.current?.value || "");
    formData.append("fridayHr", refs.fridayHr.current?.value || "");
    formData.append("saturdayHr", refs.saturdayHr.current?.value || "");
    try {
      const response = await fetch("/api/homepage", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "Homepage settings saved successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: result.error || "Failed to save settings",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred",
        icon: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      {" "}
      <div className="mx-auto max-w-7xl">
        {" "}
        {/* Header Section */}{" "}
        <div className="mb-8">
          {" "}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            {" "}
            <div className="flex flex-col justify-between md:flex-row md:items-center">
              {" "}
              <div className="mb-4 md:mb-0">
                {" "}
                <h1 className="mb-2 text-3xl font-bold text-slate-800">
                  {" "}
                  Edit Homepage{" "}
                </h1>{" "}
                <p className="text-slate-600">
                  {" "}
                  Customize your website homepage content and settings{" "}
                </p>{" "}
              </div>{" "}
              <div className="flex items-center">
                {" "}
                <div className="mr-6 text-right">
                  {" "}
                  <p className="text-sm text-slate-500">Active Section</p>{" "}
                  <p className="text-xl font-bold text-indigo-600">
                    {" "}
                    {activeSection}{" "}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Content Section */}{" "}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          {" "}
          <div className="flex flex-col md:flex-row">
            {" "}
            {/* Navigation */}{" "}
            <div className="w-full border-b border-slate-200 p-6 md:w-1/4 md:border-b-0 md:border-r">
              {" "}
              <div className="space-y-3">
                {" "}
                {sections.map((section) => (
                  <div
                    key={section}
                    className={`cursor-pointer rounded-xl p-4 transition-all duration-200 ${activeSection === section ? "bg-indigo-500 text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                    onClick={() => setActiveSection(section)}
                  >
                    {" "}
                    <div className="flex items-center">
                      {" "}
                      <div
                        className={`mr-3 h-2 w-2 rounded-full ${activeSection === section ? "bg-white" : "bg-indigo-500"}`}
                      ></div>{" "}
                      <span className="font-medium">{section}</span>{" "}
                    </div>{" "}
                  </div>
                ))}{" "}
              </div>{" "}
            </div>{" "}
            {/* Form Content */}{" "}
            <div className="w-full p-6 md:w-3/4">
              {" "}
              <form onSubmit={handleSubmit} className="space-y-6">
                {" "}
                {/* SEO Section */}{" "}
                {activeSection === "SEO Section" && (
                  <div>
                    {" "}
                    <h2 className="mb-4 text-xl font-semibold text-slate-800">
                      {" "}
                      SEO Settings{" "}
                    </h2>{" "}
                    <div className="mb-4">
                      {" "}
                      <Label
                        htmlFor="title"
                        className="mb-2 block font-medium text-slate-700"
                      >
                        {" "}
                        Page Title{" "}
                      </Label>{" "}
                      <TextInput
                        id="title"
                        ref={refs.title}
                        placeholder="Homepage title for SEO"
                        className="rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <Label
                        htmlFor="meta-description"
                        className="mb-2 block font-medium text-slate-700"
                      >
                        {" "}
                        Meta Description{" "}
                      </Label>{" "}
                      <Textarea
                        id="meta-description"
                        ref={refs.metaDescription}
                        rows={5}
                        placeholder="Description for search engines"
                        className="rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />{" "}
                    </div>{" "}
                  </div>
                )}{" "}
                {/* Search Section */}{" "}
                {activeSection === "Search Section" && (
                  <div>
                    {" "}
                    <h2 className="mb-4 text-xl font-semibold text-slate-800">
                      {" "}
                      Search Section{" "}
                    </h2>{" "}
                    <div className="mb-4">
                      {" "}
                      <Label
                        htmlFor="search-main-heading"
                        className="mb-2 block font-medium text-slate-700"
                      >
                        {" "}
                        Main Heading{" "}
                      </Label>{" "}
                      <Textarea
                        id="search-main-heading"
                        ref={refs.searchMainHeading}
                        rows={2}
                        placeholder="Main heading text"
                        className="rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />{" "}
                    </div>{" "}
                    {/* <div className="mb-4">
                      {" "}
                      <Label
                        htmlFor="search-subheading"
                        className="mb-2 block font-medium text-slate-700"
                      >
                        {" "}
                        Subheading{" "}
                      </Label>{" "}
                      <Textarea
                        id="search-subheading"
                        ref={refs.searchSubheading}
                        rows={2}
                        placeholder="Subheading text"
                        className="rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />{" "}
                    </div>{" "} */}
                    {/* <div>
                      {" "}
                      <Label
                        htmlFor="search-description-text"
                        className="mb-2 block font-medium text-slate-700"
                      >
                        {" "}
                        Description Text{" "}
                      </Label>{" "}
                      <Textarea
                        id="search-description-text"
                        ref={refs.searchDescriptionText}
                        rows={3}
                        placeholder="Supporting description text"
                        className="rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />{" "}
                    </div>{" "} */}
                  </div>
                )}{" "}
                {/* Brand Section */}{" "}
                {/* {activeSection === "Brand Section" && (
                  <div>
                    {" "}
                    <h2 className="mb-4 text-xl font-semibold text-slate-800">
                      {" "}
                      Brand Section{" "}
                    </h2>{" "}
                    <div className="mb-4">
                      {" "}
                      <Label className="mb-2 block font-medium text-slate-700">
                        {" "}
                        Heading{" "}
                      </Label>{" "}
                      <TextInput
                        ref={refs.brandHeading}
                        placeholder="Brand section title"
                        className="rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />{" "}
                    </div>{" "}
                    <div className="mb-4">
                      {" "}
                      <Label className="mb-2 block font-medium text-slate-700">
                        {" "}
                        Description{" "}
                      </Label>{" "}
                      <Textarea
                        ref={refs.brandDescription}
                        rows={3}
                        placeholder="Brand section description"
                        className="rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <Label className="mb-2 block font-medium text-slate-700">
                        {" "}
                        Section Status{" "}
                      </Label>{" "}
                      <Select
                        ref={refs.brandStatus}
                        className="rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        {" "}
                        <option value="inactive">Inactive</option>{" "}
                        <option value="active">Active</option>{" "}
                      </Select>{" "}
                    </div>{" "}
                  </div>
                )}{" "} */}
                {/* Listing Section */}{" "}
                {activeSection === "Listing Section" && (
                  <div>
                    {" "}
                    <h2 className="mb-4 text-xl font-semibold text-slate-800">
                      {" "}
                      Vehicle Listing Section{" "}
                    </h2>{" "}
                    <div className="mb-4">
                      {" "}
                      <Label className="mb-2 block font-medium text-slate-700">
                        {" "}
                        Heading{" "}
                      </Label>{" "}
                      <TextInput
                        ref={refs.listingHeading}
                        placeholder="Listing section title"
                        className="rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <Label className="mb-2 block font-medium text-slate-700">
                        {" "}
                        Section Status{" "}
                      </Label>{" "}
                      <Select
                        ref={refs.listingStatus}
                        className="rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        {" "}
                        <option value="inactive">Inactive</option>{" "}
                        <option value="active">Active</option>{" "}
                      </Select>{" "}
                    </div>{" "}
                  </div>
                )}{" "}
                {/* Chooseus Section */}{" "}
                {/* {activeSection === "Chooseus Section" && (
                  <div>
                    {" "}
                    <h2 className="mb-4 text-xl font-semibold text-slate-800">
                      {" "}
                      Choose Us Section{" "}
                    </h2>{" "}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {" "}
                      {[1, 2, 3, 4].map((num) => (
                        <div key={num} className="rounded-xl bg-slate-50 p-4">
                          {" "}
                          <h3 className="mb-3 font-semibold text-slate-700">
                            {" "}
                            Feature #{num}{" "}
                          </h3>{" "}
                          <div className="mb-3">
                            {" "}
                            <Label className="mb-2 block text-slate-600">
                              {" "}
                              Heading{" "}
                            </Label>{" "}
                            <TextInput
                              ref={
                                refs[
                                  `chooseus${["First", "Second", "Third", "Fourth"][num - 1]}Heading`
                                ]
                              }
                              placeholder={`Feature ${num} title`}
                              className="rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                            />{" "}
                          </div>{" "}
                          <div className="mb-3">
                            {" "}
                            <Label className="mb-2 block text-slate-600">
                              {" "}
                              Description{" "}
                            </Label>{" "}
                            <Textarea
                              ref={
                                refs[
                                  `chooseus${["First", "Second", "Third", "Fourth"][num - 1]}Description`
                                ]
                              }
                              rows={3}
                              placeholder={`Feature ${num} description`}
                              className="rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                            />{" "}
                          </div>{" "}
                          <div className="mb-3">
                            {" "}
                            <Label className="mb-2 block text-slate-600">
                              {" "}
                              Button Text{" "}
                            </Label>{" "}
                            <TextInput
                              ref={
                                refs[
                                  `chooseus${["First", "Second", "Third", "Fourth"][num - 1]}ButtonText`
                                ]
                              }
                              placeholder={`Feature ${num} button text`}
                              className="rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                            />{" "}
                          </div>{" "}
                          <div>
                            {" "}
                            <Label className="mb-2 block text-slate-600">
                              {" "}
                              Link{" "}
                            </Label>{" "}
                            <TextInput
                              ref={
                                refs[
                                  `chooseus${["First", "Second", "Third", "Fourth"][num - 1]}Link`
                                ]
                              }
                              placeholder={`Feature ${num} link URL`}
                              className="rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                            />{" "}
                          </div>{" "}
                        </div>
                      ))}{" "}
                    </div>{" "}
                  </div>
                )}{" "} */}
                {/* Footer Section */}{" "}
                {activeSection === "Footer" && (
                  <div>
                    {" "}
                    <h2 className="mb-4 text-xl font-semibold text-slate-800">
                      {" "}
                      Business Hours{" "}
                    </h2>{" "}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {" "}
                      {[
                        { day: "Monday", ref: refs.mondayHr },
                        { day: "Tuesday", ref: refs.tuesdayHr },
                        { day: "Wednesday", ref: refs.wednesdayHr },
                        { day: "Thursday", ref: refs.thursdayHr },
                        { day: "Friday", ref: refs.fridayHr },
                        { day: "Saturday", ref: refs.saturdayHr },
                      ].map(({ day, ref }) => (
                        <div key={day} className="rounded-lg bg-slate-50 p-4">
                          {" "}
                          <Label className="mb-2 block font-medium text-slate-700">
                            {" "}
                            {day}{" "}
                          </Label>{" "}
                          <TextInput
                            ref={ref}
                            placeholder={`${day} hours`}
                            className="rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                          />{" "}
                        </div>
                      ))}{" "}
                    </div>{" "}
                  </div>
                )}{" "}
                <div className="border-t border-slate-200 pt-6">
                  {" "}
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    disabled={isSaving}
                  >
                    {" "}
                    {isSaving ? (
                      <>
                        {" "}
                        <svg
                          className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          {" "}
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>{" "}
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>{" "}
                        </svg>{" "}
                        Saving...{" "}
                      </>
                    ) : (
                      "Save Changes"
                    )}{" "}
                  </Button>{" "}
                </div>{" "}
              </form>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default Page;
