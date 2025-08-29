"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Sidebar,
  SidebarCollapse,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { FaPencilAlt } from "react-icons/fa";
import { TiWorld } from "react-icons/ti";
import { FaList } from "react-icons/fa";
import { RiMenu2Fill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { HiChartPie } from "react-icons/hi";
import { IoSettingsSharp } from "react-icons/io5";
import { MdAppSettingsAlt } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FaIdeal } from "react-icons/fa6";
import { IoIosContact } from "react-icons/io";
import { TbCalendarSearch } from "react-icons/tb";
import { MdOutlineSubtitles } from "react-icons/md";
import { BiMessageSquareEdit } from "react-icons/bi";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

const DrawerSidebar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/users/me", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUserRole(data.user.role);
        } else {
          console.error("Failed to fetch user data");
          const token = Cookies.get("token");
          if (token) {
            const decoded = jwt.decode(token);
            setUserRole(decoded?.role);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        const token = Cookies.get("token");
        if (token) {
          const decoded = jwt.decode(token);
          setUserRole(decoded?.role);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  if (isLoading) {
    return (
      <Button
        className="mx-3 mt-3"
        color={"dark"}
        size={"sm"}
        disabled
      >
        <RiMenu2Fill fontSize={20} />
      </Button>
    );
  }

  return (
    <div>
      <Button
        className="mx-3 mt-3 bg-app-text hover:bg-app-text/90 border-app-text text-white"
        color={"none"}
        size={"sm"}
        onClick={() => setIsDrawerOpen(true)}
      >
        <RiMenu2Fill fontSize={20} />
      </Button>

      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-start bg-black/50"
          onClick={handleCloseDrawer}
        >
          <div
            className="w-fit max-w-xs max-h-screen overflow-y-auto bg-white shadow-lg dark:bg-gray-800 scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              className="absolute right-3 top-3 text-app-text hover:text-app-button hover:bg-slate-50"
              color={"none"}
              onClick={handleCloseDrawer}
            >
              <IoMdClose fontSize={20} />
            </Button>
            <Sidebar 
              aria-label="Sidebar for the dashboard to control and manage the overall functionality"
              className="[&_.sidebar-item]:text-app-text [&_.sidebar-item:hover]:text-app-button [&_.sidebar-item:hover]:bg-slate-50 [&_.sidebar-collapse-button]:text-app-text [&_.sidebar-collapse-button:hover]:text-app-button [&_.sidebar-collapse-button:hover]:bg-slate-50"
            >
              <SidebarItems>
                <SidebarItemGroup>
                  {/* Single Items */}
                  <SidebarItem 
                    href="/admin/dashboard" 
                    icon={HiChartPie}
                    className="text-app-text hover:text-app-button hover:bg-slate-50 [&>svg]:text-slate-500 hover:[&>svg]:text-app-button"
                  >
                    Dashboard
                  </SidebarItem>
                  <SidebarItem 
                    href="/admin/contact" 
                    icon={IoIosContact}
                    className="text-app-text hover:text-app-button hover:bg-slate-50 [&>svg]:text-slate-500 hover:[&>svg]:text-app-button"
                  >
                    Contact Submissions
                  </SidebarItem>
                  <SidebarItem 
                    href="/admin/valuation" 
                    icon={BiMessageSquareEdit}
                    className="text-app-text hover:text-app-button hover:bg-slate-50 [&>svg]:text-slate-500 hover:[&>svg]:text-app-button"
                  >
                    Value Submissions
                  </SidebarItem>
                  <SidebarItem 
                    href="/admin/enquiries" 
                    icon={TbCalendarSearch}
                    className="text-app-text hover:text-app-button hover:bg-slate-50 [&>svg]:text-slate-500 hover:[&>svg]:text-app-button"
                  >
                    Car Enquiry
                  </SidebarItem>
                  <SidebarItem 
                    href="/admin/finance" 
                    icon={TbCalendarSearch}
                    className="text-app-text hover:text-app-button hover:bg-slate-50 [&>svg]:text-slate-500 hover:[&>svg]:text-app-button"
                  >
                    Finance Enquiry
                  </SidebarItem>
                  <SidebarItem 
                    href="/admin/meta-editor" 
                    icon={MdOutlineSubtitles}
                    className="text-app-text hover:text-app-button hover:bg-slate-50 [&>svg]:text-slate-500 hover:[&>svg]:text-app-button"
                  >
                    Meta Editor
                  </SidebarItem>
                  <SidebarItem 
                    href="/admin/blog" 
                    icon={FaPencilAlt}
                    className="text-app-text hover:text-app-button hover:bg-slate-50 [&>svg]:text-slate-500 hover:[&>svg]:text-app-button"
                  >
                    Manage Blogs
                  </SidebarItem>

                  {/* Collapsible Groups - Only show user management for superadmin */}
                  {userRole === "superadmin" && (
                    <>
                      <SidebarCollapse 
                        icon={FaUser} 
                        label="Manage Users"
                        className="text-app-text hover:text-app-button hover:bg-slate-50 [&>svg]:text-slate-500 hover:[&>svg]:text-app-button [&_.sidebar-collapse-button]:text-app-text [&_.sidebar-collapse-button:hover]:text-app-button [&_.sidebar-collapse-button:hover]:bg-slate-50"
                      >
                        <SidebarItem 
                          href="/admin/manage-users"
                          className="text-app-text/70 hover:text-app-button hover:bg-slate-50"
                        >
                          All users
                        </SidebarItem>
                        <SidebarItem 
                          href="/admin/createUser"
                          className="text-app-text/70 hover:text-app-button hover:bg-slate-50"
                        >
                          Create User
                        </SidebarItem>
                      </SidebarCollapse>
                      <SidebarCollapse 
                        icon={FaIdeal} 
                        label="Manage Dealers"
                        className="text-app-text hover:text-app-button hover:bg-slate-50 [&>svg]:text-slate-500 hover:[&>svg]:text-app-button [&_.sidebar-collapse-button]:text-app-text [&_.sidebar-collapse-button:hover]:text-app-button [&_.sidebar-collapse-button:hover]:bg-slate-50"
                      >
                        <SidebarItem 
                          href="/admin/view-dealer"
                          className="text-app-text/70 hover:text-app-button hover:bg-slate-50"
                        >
                          All Dealers
                        </SidebarItem>
                        <SidebarItem 
                          href="/admin/create-dealer"
                          className="text-app-text/70 hover:text-app-button hover:bg-slate-50"
                        >
                          Create Dealers
                        </SidebarItem>
                      </SidebarCollapse>
                    </>
                  )}

                  <SidebarCollapse 
                    icon={FaList} 
                    label="Manage Listings"
                    className="text-app-text hover:text-app-button hover:bg-slate-50 [&>svg]:text-slate-500 hover:[&>svg]:text-app-button [&_.sidebar-collapse-button]:text-app-text [&_.sidebar-collapse-button:hover]:text-app-button [&_.sidebar-collapse-button:hover]:bg-slate-50"
                  >
                    <SidebarItem 
                      href="/admin/listing/brand"
                      className="text-app-text/70 hover:text-app-button hover:bg-slate-50"
                    >
                      Listing Brands
                    </SidebarItem>
                    <SidebarItem 
                      href="/admin/listing/add"
                      className="text-app-text/70 hover:text-app-button hover:bg-slate-50"
                    >
                      Add Listings
                    </SidebarItem>
                    <SidebarItem 
                      href="/admin/listing/view"
                      className="text-app-text/70 hover:text-app-button hover:bg-slate-50"
                    >
                      Listings
                    </SidebarItem>
                    <SidebarItem 
                      href="/admin/listing/approved"
                      className="text-app-text/70 hover:text-app-button hover:bg-slate-50"
                    >
                      Pending Listings
                    </SidebarItem>
                  </SidebarCollapse>

                  <SidebarCollapse 
                    icon={TiWorld} 
                    label="Manage Website"
                    className="text-app-text hover:text-app-button hover:bg-slate-50 [&>svg]:text-slate-500 hover:[&>svg]:text-app-button [&_.sidebar-collapse-button]:text-app-text [&_.sidebar-collapse-button:hover]:text-app-button [&_.sidebar-collapse-button:hover]:bg-slate-50"
                  >
                    <SidebarItem 
                      href="/admin/manage-website/faq"
                      className="text-app-text/70 hover:text-app-button hover:bg-slate-50"
                    >
                      FAQ
                    </SidebarItem>
                    <SidebarItem 
                      href="/admin/manage-website/testimonial"
                      className="text-app-text/70 hover:text-app-button hover:bg-slate-50"
                    >
                      Testimonial
                    </SidebarItem>
                  </SidebarCollapse>

                  <SidebarCollapse 
                    icon={IoSettingsSharp} 
                    label="Settings"
                    className="text-app-text hover:text-app-button hover:bg-slate-50 [&>svg]:text-slate-500 hover:[&>svg]:text-app-button [&_.sidebar-collapse-button]:text-app-text [&_.sidebar-collapse-button:hover]:text-app-button [&_.sidebar-collapse-button:hover]:bg-slate-50"
                  >
                    <SidebarItem 
                      href="/admin/setting/general"
                      className="text-app-text/70 hover:text-app-button hover:bg-slate-50"
                    >
                      General Settings
                    </SidebarItem>
                    <SidebarItem 
                      href="/admin/setting/default"
                      className="text-app-text/70 hover:text-app-button hover:bg-slate-50"
                    >
                      Default Settings
                    </SidebarItem>
                    <SidebarItem 
                      href="/admin/setting/currency"
                      className="text-app-text/70 hover:text-app-button hover:bg-slate-50"
                    >
                      Currency
                    </SidebarItem>
                    <SidebarItem 
                      href="/admin/setting/social"
                      className="text-app-text/70 hover:text-app-button hover:bg-slate-50"
                    >
                      Social Media
                    </SidebarItem>
                  </SidebarCollapse>

                  <SidebarCollapse 
                    icon={MdAppSettingsAlt} 
                    label="Page Settings"
                    className="text-app-text hover:text-app-button hover:bg-slate-50 [&>svg]:text-slate-500 hover:[&>svg]:text-app-button [&_.sidebar-collapse-button]:text-app-text [&_.sidebar-collapse-button:hover]:text-app-button [&_.sidebar-collapse-button:hover]:bg-slate-50"
                  >
                    <SidebarItem 
                      href="/admin/setting/page/home"
                      className="text-app-text/70 hover:text-app-button hover:bg-slate-50"
                    >
                      Home
                    </SidebarItem>
                    <SidebarItem 
                      href="/admin/setting/page/contact"
                      className="text-app-text/70 hover:text-app-button hover:bg-slate-50"
                    >
                      Contact
                    </SidebarItem>
                    <SidebarItem 
                      href="/admin/setting/page/about"
                      className="text-app-text/70 hover:text-app-button hover:bg-slate-50"
                    >
                      Utility pages
                    </SidebarItem>
                  </SidebarCollapse>
                </SidebarItemGroup>
              </SidebarItems>
            </Sidebar>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawerSidebar;