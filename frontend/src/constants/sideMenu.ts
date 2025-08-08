'use client';
import { UseSessionReturn } from "@app/types/Session";
import { MdBusiness, MdCollections, MdOutlineAddPhotoAlternate  } from 'react-icons/md';
import { FaUserEdit } from "react-icons/fa";
import { IconType } from 'react-icons';

export type menuItem = {
  name: string;
  url: string;
  icon: IconType;
};

export type menuSection = {
  section: {
    name: string;
    items: menuItem[];
  }
};

export type sideMenuItemsType = {
  [userPermission: string]: menuSection[];
};

export const sideMenuItems = (session: UseSessionReturn): sideMenuItemsType => ({
  admin: [
    { 
      section: {
        name: "Cadastros",
        items: [
          {
            name: 'Empresas',
            icon: MdBusiness,
            url: '/admin/companies',
          },
          {
            name: 'Coleções',
            icon: MdCollections,
            url: '/admin/collections',
          },
          {
            name: 'Equipamentos',
            icon: MdOutlineAddPhotoAlternate,
            url: '/admin/assets',
          },
        ],
      },
    },
    {
      section: {
        name: "Configurações",
        items: [
          {
            name: 'Perfil',
            icon: FaUserEdit,
            url:  `/${session?.data?.user?.usr_permission}/profile`,
          },
        ],
      },
    },
  ],

  owner: [
    { 
      section: {
        name: "Cadastros",
        items: [
          {
            name: 'Equipamentos',
            icon: MdOutlineAddPhotoAlternate,
            url: '/owner/assets',
          },
        ],
      },
    },
    {
      section: {
        name: "Configurações",
        items: [
          {
            name: 'Perfil',
            icon: FaUserEdit,
            url:  `/${session?.data?.user?.com_type}/profile`,
          },
        ],
      },
    },
  ],

  maintainer: [
    { 
      section: {
        name: "Cadastros",
        items: [
          {
            name: 'Equipamentos',
            icon: MdOutlineAddPhotoAlternate,
            url: '/maintainer/assets',
          },
        ],
      },
    },
    {
      section: {
        name: "Configurações",
        items: [
          {
            name: 'Perfil',
            icon: FaUserEdit,
            url:  `/${session?.data?.user?.com_type}/profile`,
          },
        ],
      },
    },
  ],

  creator: [
    { 
      section: {
        name: "Cadastros",
        items: [
          {
            name: 'Equipamentos',
            icon: MdOutlineAddPhotoAlternate,
            url: '/creator/assets',
          },
        ],
      },
    },
    {
      section: {
        name: "Configurações",
        items: [
          {
            name: 'Perfil',
            icon: FaUserEdit,
            url:  `/${session?.data?.user?.com_type}/profile`,
          },
        ],
      },
    },
  ],
})