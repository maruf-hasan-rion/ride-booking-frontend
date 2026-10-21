import { useState } from "react";
import { Link } from "react-router";
import { AlertTriangle, MapPin, MessageSquare, Phone, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useEmergencyContacts, type EmergencyRole } from "@/hooks/useEmergencyContacts";
import { SAFETY_PATH_BY_ROLE, getPathByRole } from "@/constants/paths";

type EmergencySOSButtonProps = {
  isActiveRide: boolean;
  role: EmergencyRole;
  emergencyNumber?: string;
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

const getGoogleMapsUrl = (coordinates: Coordinates) =>
  `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`;

const toWhatsAppNumber = (value: string) => value.replace(/\D/g, "");

const getCurrentCoordinates = async (): Promise<Coordinates> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported in this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        reject(new Error("Unable to fetch current location."));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

export const EmergencySOSButton = ({
  isActiveRide,
  role,
  emergencyNumber = "999",
}: EmergencySOSButtonProps) => {
  const { contacts } = useEmergencyContacts(role);
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [location, setLocation] = useState<Coordinates | null>(null);

  if (!isActiveRide) {
    return null;
  }

  const ensureLocation = async () => {
    if (location) return location;

    setIsLocating(true);
    try {
      const coordinates = await getCurrentCoordinates();
      setLocation(coordinates);
      return coordinates;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to fetch current location.";
      toast.error(message);
      return null;
    } finally {
      setIsLocating(false);
    }
  };

  const handleDialogToggle = (next: boolean) => {
    setIsOpen(next);
    if (next && !location) {
      void ensureLocation();
    }
  };

  const handleCallPolice = () => {
    window.location.href = `tel:${emergencyNumber}`;
    toast.success("Calling emergency support.");
  };

  const getEmergencyMessage = (coordinates: Coordinates | null) => {
    const locationText = coordinates
      ? getGoogleMapsUrl(coordinates)
      : "Current location unavailable";

    return `Emergency alert. I need help during an active ride. My location: ${locationText}`;
  };

  const handleNotifyContactBySms = async () => {
    const contact = contacts[0];
    if (!contact) {
      toast.error("No emergency contact found. Add one from Safety Settings.");
      return;
    }

    const coordinates = await ensureLocation();
    const message = getEmergencyMessage(coordinates);
    window.location.href = `sms:${contact.phone}?body=${encodeURIComponent(message)}`;
    toast.success(`Emergency contact notified: ${contact.name}`);
    setIsOpen(false);
  };

  const handleNotifyContactByWhatsApp = async () => {
    const contact = contacts[0];
    if (!contact) {
      toast.error("No emergency contact found. Add one from Safety Settings.");
      return;
    }

    const coordinates = await ensureLocation();
    const message = getEmergencyMessage(coordinates);
    const phone = toWhatsAppNumber(contact.phone);

    if (!phone) {
      toast.error("Emergency contact phone format is invalid.");
      return;
    }

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
    toast.success(`Opening WhatsApp for ${contact.name}.`);
    setIsOpen(false);
  };

  const handleShareLiveLocation = async () => {
    const coordinates = await ensureLocation();
    if (!coordinates) return;

    const url = getGoogleMapsUrl(coordinates);
    const shareData = {
      title: "Live location",
      text: "Sharing my live location from ride app safety mode.",
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Location shared successfully.");
      } catch {
        toast.error("Unable to share location.");
      }
      setIsOpen(false);
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Location link copied to clipboard.");
      setIsOpen(false);
    } catch {
      toast.error("Unable to copy location link.");
    }
  };

  return (
    <>
      <Button
        type="button"
        aria-label="Open emergency SOS options"
        onClick={() => handleDialogToggle(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-destructive text-destructive-foreground shadow-lg hover:opacity-95"
      >
        <AlertTriangle className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={handleDialogToggle}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Emergency SOS
            </DialogTitle>
            <DialogDescription>
              Use one of the options below to get help quickly.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
              {isLocating ? "Detecting your location..." : location ? "Location detected." : "Location not detected yet."}
              <div className="mt-2">
                <Link to={getPathByRole(role, SAFETY_PATH_BY_ROLE)} className="font-medium text-primary underline">
                  Manage emergency contacts
                </Link>
              </div>
            </div>

            <Button type="button" onClick={handleCallPolice} className="w-full justify-start gap-2" variant="destructive">
              <Phone className="h-4 w-4" />
              Call Police ({emergencyNumber})
            </Button>

            <Button type="button" onClick={handleNotifyContactBySms} className="w-full justify-start gap-2">
              <MessageSquare className="h-4 w-4" />
              Notify Emergency Contact (SMS)
            </Button>

            <Button
              type="button"
              onClick={handleNotifyContactByWhatsApp}
              className="w-full justify-start gap-2"
              variant="outline"
            >
              <MessageSquare className="h-4 w-4" />
              Notify Emergency Contact (WhatsApp)
            </Button>

            <Button
              type="button"
              onClick={handleShareLiveLocation}
              className="w-full justify-start gap-2"
              variant="outline"
            >
              <Share2 className="h-4 w-4" />
              Share Live Location
            </Button>
          </div>

          <Separator />
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-4 w-4" />
            SOS appears only during active rides for safety support.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};
