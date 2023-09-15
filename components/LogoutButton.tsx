import { useAuth0 } from '@auth0/auth0-react';
import { IconLogout } from '@tabler/icons-react';

import DropdownButton from './DropdownButton';

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <DropdownButton
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      <IconLogout size="1.25em"></IconLogout>
      Log Out
    </DropdownButton>
  );
};

export default LogoutButton;
