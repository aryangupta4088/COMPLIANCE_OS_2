import React, { useState } from 'react';
import { Menu, X, LayoutGrid, Users, FileText, LogOut } from 'lucide-react';

export const CASidebar = ({ isOpen, onClose, onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', id: 'dashboard' },
    { icon: Users, label: 'Clients', id: 'clients' },
    { icon: FileText, label: 'Documents', id: 'documents' },
    { icon: LogOut, label: 'Logout', id: 'logout' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-cs-900 text-white transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:w-64 ${isCollapsed && 'md:w-20'} md:flex md:flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cs-800">
          {!isCollapsed && <span className="font-bold text-lg">CA Portal</span>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:block p-2 hover:bg-cs-800 rounded"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="md:hidden p-2 hover:bg-cs-800 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-cs-800 transition text-left"
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-cs-800 text-xs text-cs-400">
          {!isCollapsed && <p>© 2024 ComplianceOS</p>}
        </div>
      </aside>
    </>
  );
};

export default CASidebar;
