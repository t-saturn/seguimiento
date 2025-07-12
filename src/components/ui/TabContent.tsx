interface PropTabContent {
  open: string;
  tabCategory: string;
  details: React.ReactNode;
}

export const TabContent = ({ open, tabCategory, details }: PropTabContent) => {
  return (
    <div>
      <div
        className={`p-6 text-base leading-relaxed text-body-color dark:text-dark-6 ${
          open === tabCategory ? "block" : "hidden"
        } `}
      >
        {details}
      </div>
    </div>
  );
};
