# obyte-icons
## Generating icons for bonded stablecoins

### How use it via jsdelivr
You can access the icons via jsdelivr at the link: `https://cdn.jsdelivr.net/npm/obyte-icons@latest/build/IUSD.svg`. To get inverted icons, add -INV to the name (ex. IUSD-INV.svg).

List of icons: `https://cdn.jsdelivr.net/npm/obyte-icons@latest/build/list.json`


### Steps to create an icon

1. Create an icon with attribute viewBox="0 0 88 88" in parent svg element
2. Move in icons/stablecoin folder with name like [fund-symbol]-[interest-symbol]-[stable-symbol].svg (Example: SFUSD-IUSDV2-OUSDV2.svg)
3. yarn / npm i
4. yarn start / npm start
5. Save changes