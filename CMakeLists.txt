cmake_minimum_required (VERSION 2.8)

set(PROJECT_NAME "movim-desktop")
set(VERSION_MAJOR "0")
set(VERSION_MINOR "10")
set(VERSION_PATCH "0")

project(${PROJECT_NAME})

find_package(PkgConfig REQUIRED)
install(DIRECTORY movim-linux-armv7l/ DESTINATION /opt/movim) # replace with ia32 or x64
install(FILES "debian/movim.desktop" DESTINATION "/usr/share/applications")
install(FILES "icons/22.png" DESTINATION "/usr/share/icons/hicolor/22x22/apps/" RENAME "movim.png")
install(FILES "icons/24.png" DESTINATION "/usr/share/icons/hicolor/24x24/apps/" RENAME "movim.png")
install(FILES "icons/32.png" DESTINATION "/usr/share/icons/hicolor/32x32/apps/" RENAME "movim.png")
install(FILES "icons/48.png" DESTINATION "/usr/share/icons/hicolor/48x48/apps/" RENAME "movim.png")
install(FILES "icons/64.png" DESTINATION "/usr/share/icons/hicolor/64x64/apps/" RENAME "movim.png")
install(FILES "icons/128.png" DESTINATION "/usr/share/icons/hicolor/128x128/apps/" RENAME "movim.png")
install(FILES "icons/256.png" DESTINATION "/usr/share/icons/hicolor/256x256/apps/" RENAME "movim.png")

# package settings
set(CPACK_PACKAGE_DESCRIPTION_SUMMARY "Kick Ass Social Network, decentralized and fully based on XMPP ")
set(CPACK_PACKAGE_VENDOR "Jaussoin Timothée")
set(CPACK_PACKAGE_CONTACT "edhelas@movim.eu")
set(CPACK_PACKAGE_VERSION_MAJOR "${VERSION_MAJOR}")
set(CPACK_PACKAGE_VERSION_MINOR "${VERSION_MINOR}")
set(CPACK_PACKAGE_VERSION_PATCH "${VERSION_PATCH}")
set(CPACK_DEBIAN_PACKAGE_ARCHITECTURE "armhf") # replace with i386 or amd64
#set(CPACK_RESOURCE_FILE_LICENSE "../COPYING")
set(CPACK_SOURCE_PACKAGE_FILE_NAME "${CMAKE_PROJECT_NAME}_${VERSION}")
set(ACK_PACKAGE_FILE_NAME "${CMAKE_PROJECT_NAME}_${VERSION}")
set(CPACK_DEBIAN_PACKAGE_DESCRIPTION "Kickass distributed social networking platform that protect your privacy and comes with a set of awesome features.")
set(CPACK_DEBIAN_PACKAGE_MAINTAINER "Jaussoin Timothée <edhelas@movim.eu>")
set(CPACK_DEBIAN_PACKAGE_HOMEPAGE "https://movim.eu/")

set(CPACK_DEBIAN_PACKAGE_CONTROL_EXTRA "${CMAKE_CURRENT_SOURCE_DIR}/debian/postinst;${CMAKE_CURRENT_SOURCE_DIR}/debian/postrm;")

set(PACK "DEB" CACHE STRING "Generate a Package")
set(CPACK_GENERATOR ${PACK})

include(CPack)
