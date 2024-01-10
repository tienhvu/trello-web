import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar() {
  return (
    <Box sx = {{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => ( theme.palette.mode === 'dark' ? '#34495e' : '#1976d2' ),
      borderBottom: '1px solid white'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={ MENU_STYLES }
          icon={<DashboardIcon />} label="Tien Vu Hoang"
          // onclick={ () => {} }
          clickable />

        <Chip
          sx={ MENU_STYLES }
          icon={<VpnLockIcon />} label="Public/Private Workspaces"
          // onclick={ () => {} }
          clickable />

        <Chip
          sx={ MENU_STYLES }
          icon={<AddToDriveIcon />} label="Add to Google Driver"
          // onclick={ () => {} }
          clickable />

        <Chip
          sx={ MENU_STYLES }
          icon={<BoltIcon />} label="Automation"
          // onclick={ () => {} }
          clickable />

        <Chip
          sx={ MENU_STYLES }
          icon={<FilterListIcon />} label="Filters"
          // onclick={ () => {} }
          clickable />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="outlined" startIcon={<PersonAddIcon />}
          sx={{ 
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' } }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={3}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none'
            }
          }}>
          <Tooltip title="tienhvu">
            <Avatar
              alt="Tienvu"
              src="https://scontent.fhan14-4.fna.fbcdn.net/v/t1.6435-9/103307569_1336497023407992_2288305468433669515_n.jpg?_nc_cat=103&amp;ccb=1-7&amp;_nc_sid=7a1959&amp;_nc_eui2=AeHI12oEscFRldUNlFFhhUtCO8EzAyGqA_A7wTMDIaoD8Kwwd7VIjPZnbYwRJmHZ-Rdz7quMOIGzP1KulI1JZJKD&amp;_nc_ohc=E03df7_bgbUAX8gg7uR&amp;_nc_ht=scontent.fhan14-4.fna&amp;oh=00_AfD086E44GryfhSvXWiy8Dc9RD5UsR6jI6fVVSPvd-WK2g&amp;oe=65C5EFD6" />
          </Tooltip>
          <Tooltip title="tienhvu">
            <Avatar
              alt="Tienvu"
              src="https://scontent.fhan14-3.fna.fbcdn.net/v/t1.6435-9/161574063_1568503313540694_4201745355742124585_n.jpg?_nc_cat=110&amp;ccb=1-7&amp;_nc_sid=7a1959&amp;_nc_eui2=AeH-73jXtEjJTfH6Mx2wcwpFRWj0nFBRfmZFaPScUFF-ZmSdJZMJ52RvNty5lsa8iBEXZ5m-q72fVDD_oQW9X79h&amp;_nc_ohc=b6s3iXMI7DAAX__-LN7&amp;_nc_ht=scontent.fhan14-3.fna&amp;oh=00_AfA03VFJAlqSWinAlbQ4WkOyDDflAj6qeqZ8YVXFQfEXLA&amp;oe=65C5E70F" />
          </Tooltip>
          <Tooltip title="tienhvu">
            <Avatar
              alt="Tienvu"
              src="https://yt3.ggpht.com/2IzNZFgtBEeT11CorQOFVg2Xv4IgVTpTH94NhnwWXHGS1P9zIoA6_plTwJVT-OtCEbGmWba7Eg=s88-c-k-c0x00ffffff-no-rj" />
          </Tooltip>
          <Tooltip title="tienhvu">
            <Avatar
              alt="Tienvu"
              src="https://yt3.ggpht.com/2IzNZFgtBEeT11CorQOFVg2Xv4IgVTpTH94NhnwWXHGS1P9zIoA6_plTwJVT-OtCEbGmWba7Eg=s88-c-k-c0x00ffffff-no-rj" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
