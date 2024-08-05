/* eslint-disable @next/next/no-img-element */
'use client';
import Visits from './components/Visits';
import { Fragment } from 'react';
import { RootState } from '@/lib/store';
import React from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { toogleChanges } from '@/lib/features/workspace/workSpaceHeaderSlice';

import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  navigation,
  userNavigation,
  classNames,
  user,
} from '@/static/dashboard';
import Patients from './pages/Patients';
import Companions from './pages/Companions';

export default function Page() {
  const workspaceHeader = useSelector(
    (state: RootState) => state.workspaceHeader
  );
  const dispatch = useDispatch();

  const renderSection = () => {
    switch (workspaceHeader.header) {
      case 'Visits':
        return <Visits />;
      case 'Patients':
        return <Patients />;
      case 'Companions':
        return <Companions />;
      case 'Visits':
        return <Visits />;
    }
  };

  function handleLogout() {
    localStorage.removeItem('access_token');
    window.location.href = '/';
  }

  return (
    <>
      <div
        className={`flex flex-col h-screen overflow-x-hidden overflow-y-hidden `}
      ></div>
    </>
  );
}
